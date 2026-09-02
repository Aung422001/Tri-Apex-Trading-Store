import type { GenerateContentResult } from '@google/generative-ai'
import { getGeminiFlash, getGeminiPro } from '../config/gemini'
import { cacheGet } from '../config/redis'
import prisma from '../config/database'
import { env } from '../config/env'
import { AppError } from '../utils/apiResponse'
import crypto from 'crypto'

interface UserPreferences {
    budget: number
    useCase: 'hobby' | 'professional' | 'industrial' | 'education'
    experience: 'beginner' | 'intermediate' | 'expert'
    requirements?: string
}

interface Recommendation {
    productId: string
    reason: string
    highlights: string[]
}

/**
 * Normalise anything thrown by a Gemini call into an AppError.
 *
 * The SDK throws Error objects whose message is the whole upstream body — API
 * URL, quota metric names, billing links. Those were reaching clients verbatim
 * through the generic error handler; map them to clean statuses and keep the
 * detail in the server log.
 */
export function toAiError(err: unknown): AppError {
    if (err instanceof AppError) return err

    const message = err instanceof Error ? err.message : String(err)
    console.error('AI service error:', message)

    if (message.includes('not configured')) {
        return new AppError(503, 'AI service not available')
    }
    if (message.includes('429') || /quota|rate limit/i.test(message)) {
        return new AppError(429, 'AI service is busy right now — please try again in a minute')
    }
    if (message.includes('503') || /high demand|Service Unavailable/i.test(message)) {
        return new AppError(503, 'AI service is temporarily unavailable — please try again shortly')
    }
    if (message.includes('404')) {
        return new AppError(503, 'AI model unavailable — check GEMINI_MODEL_FLASH / GEMINI_MODEL_PRO')
    }
    if (message.includes('400') || /API key/i.test(message)) {
        return new AppError(503, 'AI service is misconfigured')
    }
    return new AppError(502, 'AI request failed')
}

/**
 * Turn a Gemini response into parsed JSON.
 *
 * Gemini signals a truncated answer with finishReason MAX_TOKENS rather than an
 * error, which used to surface as an opaque "failed to parse" 500. Check that
 * first so the real cause reaches the logs.
 */
function parseJsonResponse<T>(result: { response: GenerateContentResult['response'] }, label: string): T {
    const finishReason = result.response.candidates?.[0]?.finishReason

    if (finishReason === 'MAX_TOKENS') {
        throw new AppError(500, `AI ${label} response was truncated — raise maxOutputTokens`)
    }
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
        throw new AppError(502, `AI ${label} response was blocked (${finishReason})`)
    }

    const text = result.response.text().replace(/```json|```/g, '').trim()
    if (!text) throw new AppError(502, `AI returned an empty ${label} response`)

    try {
        return JSON.parse(text) as T
    } catch {
        console.error(`Failed to parse AI ${label} response:`, text.slice(0, 500))
        throw new AppError(500, `Failed to parse AI ${label} response`)
    }
}

const TRIBOT_SYSTEM_PROMPT = `You are Tribot, the helpful AI assistant for Triapex Trading Group, a professional 3D printer retailer based in Yangon, Myanmar.

You help customers with:
- Product recommendations (FDM printers, resin printers, filaments, accessories)
- Order inquiries (ask for the order ID if a customer needs order-specific help)
- Technical troubleshooting and 3D printing tips
- Shipping info: free shipping on orders over MMK 500, standard 3-5 days, express 1-2 days (MMK 35)
- Return policy: 14 days for unused items in original packaging
- Warranty: 1-year manufacturer warranty on all printers
- Business hours: Mon–Fri 9:00 AM – 6:00 PM
- Contact: kht@triapextradinggroupmm.com | +95 944 999 7080
- Address: No.612, Shin Htwe Nyo Street, East Dagon Township, Yangon, Myanmar

Top products:
- Bambu Lab X1 Carbon Combo – MMK 6,899 (flagship CoreXY, multi-color AMS)
- Bambu Lab P1S Combo – MMK 3,599 (enclosed, high-speed)
- Creality Ender-3 V3 SE – MMK 899 (best beginner FDM printer)
- Creality K1 Max – MMK 3,299 (large format 300x300x300mm)
- Prusa MK4S – MMK 3,899 (legendary reliability)
- Elegoo Saturn 4 Ultra – MMK 2,399 (12K resin, ultra detail)
- Anycubic Photon Mono M7 Pro – MMK 2,199 (14K resin)
- FlashForge Adventurer 5M Pro – MMK 2,499 (fast enclosed)
- eSUN PLA+ Filament 1kg – MMK 79
- Hardened Steel Nozzle Set – MMK 49

Be friendly, concise, and professional. Keep responses under 3 sentences when possible.
For complex technical issues, direct users to kht@triapextradinggroupmm.com.
Never mention Gemini, Google AI, or any other AI provider. You are Tribot.`

export class AIService {

    /** AI Product Recommender — uses Gemini (not region-restricted for this use case) */
    async getRecommendations(preferences: UserPreferences): Promise<Recommendation[]> {
        const model = getGeminiFlash({ json: true })

        const products = await prisma.product.findMany({
            where: { published: true, stock: { gt: 0 } },
            select: { id: true, name: true, price: true, shortDescription: true, printTechnology: true, buildVolume: true },
            take: 50,
        })

        const prefHash = crypto.createHash('md5').update(JSON.stringify(preferences)).digest('hex')

        return cacheGet(`ai:recommend:${prefHash}`, async () => {
            const prompt = `You are an expert 3D printer consultant at Triapex Trading Group.
Help this customer choose the best 3D printer.

Customer Profile:
- Budget: MMK ${preferences.budget}
- Use Case: ${preferences.useCase}
- Experience Level: ${preferences.experience}
- Special Requirements: ${preferences.requirements || 'None'}

Available Products (JSON):
${JSON.stringify(products, null, 2)}

Return ONLY a valid JSON array of exactly 3 recommendations:
[{"productId": "...", "reason": "2-3 sentence explanation", "highlights": ["point1", "point2"]}]`

            const result = await model.generateContent(prompt)
            return parseJsonResponse<Recommendation[]>(result, 'recommendation')
        }, 3600)
    }

    /**
     * AI Support Chatbot — powered by Anthropic Claude
     * Replaces Gemini which is geo-blocked in Myanmar
     */
    async chat(message: string, history: Array<{ role: string; text: string }>) {
        const apiKey = env.ANTHROPIC_API_KEY

        // Treat the env.example placeholder as unset — otherwise it reaches the
        // API and comes back as an opaque 401.
        if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
            throw new AppError(503, 'AI chat not configured')
        }

        // Build messages array for Claude — map frontend history to Anthropic format
        const messages: Array<{ role: 'user' | 'assistant'; content: string }> = []

        for (const h of history) {
            // Frontend sends role as 'user' or 'model' (Gemini naming)
            const role = h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user'
            messages.push({ role, content: h.text })
        }

        // Add the new user message
        messages.push({ role: 'user', content: message })

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-5',
                max_tokens: 1000,
                // Tribot answers short support questions — low effort keeps
                // latency and token spend down.
                output_config: { effort: 'low' },
                system: TRIBOT_SYSTEM_PROMPT,
                messages,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('Anthropic API error:', response.status, errText)
            // A bad key is a deployment problem, not a transient outage — say so
            // rather than hiding it behind "temporarily unavailable".
            if (response.status === 401 || response.status === 403) {
                throw new AppError(503, 'AI chat not configured: ANTHROPIC_API_KEY is invalid')
            }
            throw new AppError(502, 'AI service temporarily unavailable')
        }

        const data = await response.json() as {
            content: Array<{ type: string; text: string }>
        }

        const reply = data.content?.find(c => c.type === 'text')?.text

        if (!reply) {
            throw new AppError(502, 'Empty response from AI service')
        }

        return reply
    }

    /** AI Product Comparison */
    async compareProducts(productIds: string[]) {
        if (productIds.length < 2 || productIds.length > 3) {
            throw new AppError(400, 'Provide 2-3 product IDs to compare')
        }

        const model = getGeminiFlash({ json: true })
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { brand: true, category: true },
        })

        if (products.length !== productIds.length) {
            throw new AppError(404, 'One or more products not found')
        }

        // Copy before sorting — sort() mutates in place, and productIds is the
        // caller's array (req.body.productIds).
        const cacheKey = `ai:compare:${[...productIds].sort().join('-')}`

        return cacheGet(cacheKey, async () => {
            const prompt = `You are a 3D printer expert. Compare these products neutrally:

${JSON.stringify(products.map((p) => ({
                name: p.name, brand: (p.brand as any)?.name, price: p.price,
                technology: p.printTechnology, buildVolume: p.buildVolume, specs: p.specs,
            })), null, 2)}

Return ONLY valid JSON:
{
  "summary": "Overall comparison paragraph",
  "products": [{"name": "...", "pros": ["..."], "cons": ["..."]}],
  "verdict": {"hobby": "productName", "professional": "productName", "bestValue": "productName"},
  "comparisonTable": [{"feature": "...", "values": ["product1Val", "product2Val"]}]
}`

            const result = await model.generateContent(prompt)
            return parseJsonResponse(result, 'comparison')
        }, 3600)
    }

    /** AI Product Description Generator (Admin) */
    async generateDescription(data: {
        productName: string
        brand: string
        specs: Record<string, any>
        category: string
        targetAudience: string
    }) {
        const model = getGeminiPro({ json: true })

        const prompt = `Write compelling e-commerce copy for a 3D printer product:
Product: ${data.productName}, Brand: ${data.brand}, Category: ${data.category}
Key Specs: ${JSON.stringify(data.specs)}
Target: ${data.targetAudience}
Provide: 1) Short description (150 chars max),
2) Full HTML description (400-600 words, use <h3>, <ul>, <p>),
3) SEO title (60 chars), 4) Meta description (155 chars),
5) 5 key highlights as array.
Return ONLY valid JSON:
{"shortDescription": "...", "fullDescription": "...", "seoTitle": "...", "metaDescription": "...", "highlights": ["..."]}`

        const result = await model.generateContent(prompt)
        return parseJsonResponse(result, 'description')
    }

    /** AI Image Analysis (Admin) */
    async analyzeImage(imageBase64: string, mimeType: string) {
        const model = getGeminiPro({ json: true })

        const result = await model.generateContent([
            { inlineData: { mimeType, data: imageBase64 } },
            `Analyze this product image for a 3D printer e-commerce store.
Return ONLY valid JSON:
{
  "productType": "type of product",
  "visibleFeatures": ["feature1", "feature2"],
  "suggestedTags": ["tag1", "tag2"],
  "qualityAssessment": "assessment",
  "suggestedAltText": "descriptive alt text"
}`,
        ])

        return parseJsonResponse(result, 'image analysis')
    }
}

export const aiService = new AIService()
