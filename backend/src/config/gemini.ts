import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
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

export function getGeminiFlash() {
    if (!genAI) throw new Error('Gemini API not configured')
    return genAI.getGenerativeModel({
        model: env.GEMINI_MODEL_FLASH,
        generationConfig: { temperature: env.GEMINI_TEMPERATURE, maxOutputTokens: 512 },
        safetySettings,
    })
}

export function getGeminiPro() {
    if (!genAI) throw new Error('Gemini API not configured')
    return genAI.getGenerativeModel({
        model: env.GEMINI_MODEL_PRO,
        generationConfig: { temperature: env.GEMINI_TEMPERATURE, maxOutputTokens: 2048 },
        safetySettings,
    })
}

export { genAI }
