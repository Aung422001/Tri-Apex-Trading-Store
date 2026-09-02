import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig } from '@google/generative-ai'
import { env } from './env'

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

let genAI: GoogleGenerativeAI | null = null
if (env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
}

/**
 * Gemini 2.5 models are "thinking" models: reasoning tokens are spent out of
 * maxOutputTokens before a single character of the answer is emitted, and
 * thinking expands to fill whatever budget it is given. With the old 512-token
 * cap, ~490 tokens went to thinking and the JSON came back truncated mid-string
 * — which surfaced as an opaque "Failed to parse AI response" 500.
 *
 * Raising the cap alone does not fix it (measured on the live catalog: 2048 ->
 * 1962 thinking tokens, 4096 -> 3903, both still truncated). Every consumer here
 * wants structured extraction, not reasoning, so thinking is off by default:
 * the same call then completes in ~3.7s instead of ~22s and uses ~390 output
 * tokens instead of ~4400.
 */
const FLASH_MAX_OUTPUT_TOKENS = 2048
const PRO_MAX_OUTPUT_TOKENS = 4096

interface ModelOptions {
    /** Ask Gemini for raw JSON instead of a ```json-fenced markdown block. */
    json?: boolean
    maxOutputTokens?: number
    /** Reasoning tokens to allow. 0 disables thinking (the default here). */
    thinkingBudget?: number
}

function buildGenerationConfig(defaultMaxOutputTokens: number, options: ModelOptions) {
    return {
        temperature: env.GEMINI_TEMPERATURE,
        maxOutputTokens: options.maxOutputTokens ?? defaultMaxOutputTokens,
        ...(options.json ? { responseMimeType: 'application/json' as const } : {}),
        // thinkingConfig is accepted by the REST API but missing from the
        // @google/generative-ai 0.24 types, hence the cast at the call site.
        thinkingConfig: { thinkingBudget: options.thinkingBudget ?? 0 },
    }
}

export function getGeminiFlash(options: ModelOptions = {}) {
    if (!genAI) throw new Error('Gemini API not configured')
    return genAI.getGenerativeModel({
        model: env.GEMINI_MODEL_FLASH,
        generationConfig: buildGenerationConfig(FLASH_MAX_OUTPUT_TOKENS, options) as GenerationConfig,
        safetySettings,
    })
}

export function getGeminiPro(options: ModelOptions = {}) {
    if (!genAI) throw new Error('Gemini API not configured')
    return genAI.getGenerativeModel({
        model: env.GEMINI_MODEL_PRO,
        generationConfig: buildGenerationConfig(PRO_MAX_OUTPUT_TOKENS, options) as GenerationConfig,
        safetySettings,
    })
}

export { genAI }
