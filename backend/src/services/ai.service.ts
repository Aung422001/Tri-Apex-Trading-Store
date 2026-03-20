import { getGeminiFlash, getGeminiPro } from '../config/gemini'
import { cacheGet } from '../config/redis'
import prisma from '../config/database'
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

export class AIService {
    /** AI Product Recommender */
    async getRecommendations(preferences: UserPreferences): Promise<Recommendation[]> {
        const model = getGeminiFlash()

        // Fetch available products
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
- Budget: MYR ${preferences.budget}
- Use Case: ${preferences.useCase}
- Experience Level: ${preferences.experience}
- Special Requirements: ${preferences.requirements || 'None'}

Available Products (JSON):
${JSON.stringify(products, null, 2)}

Return ONLY a valid JSON array of exactly 3 recommendations:
[{"productId": "...", "reason": "2-3 sentence explanation", "highlights": ["point1", "point2"]}]`

            const result = await model.generateContent(prompt)
            const text = result.response.text()
            try {
                return JSON.parse(text.replace(/```json|```/g, '').trim())
            } catch {
                throw new AppError(500, 'Failed to parse AI response')
            }
        }, 3600)
    }

    /** AI Support Chatbot */
    async chat(message: string, history: Array<{ role: string; text: string }>) {
        const model = getGeminiFlash()
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: 'System context: You are Tribot, the helpful AI assistant for Triapex Trading Group, a 3D printer retailer in Malaysia. You help with product info, orders, and technical support. Be friendly and professional. If asked about specific orders, ask for the order ID. For technical issues beyond basic troubleshooting, direct users to kht@triapextradinggroupmm.com. Keep responses concise.' }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood! I\'m Tribot, ready to help with Triapex Trading Group products and services. How can I assist you today?' }],
                },
                ...history.map((h) => ({
                    role: h.role as 'user' | 'model',
                    parts: [{ text: h.text }],
                })),
            ],
        })

        const result = await chat.sendMessage(message)
        return result.response.text()
    }

    /** AI Product Comparison */
    async compareProducts(productIds: string[]) {
        if (productIds.length < 2 || productIds.length > 3) {
            throw new AppError(400, 'Provide 2-3 product IDs to compare')
        }

        const model = getGeminiFlash()
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { brand: true, category: true },
        })

        if (products.length !== productIds.length) {
            throw new AppError(404, 'One or more products not found')
        }

        const cacheKey = `ai:compare:${productIds.sort().join('-')}`

        return cacheGet(cacheKey, async () => {
            const prompt = `You are a 3D printer expert. Compare these products neutrally:

${JSON.stringify(products.map((p) => ({
                name: p.name, brand: p.brand?.name, price: p.price,
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
            const text = result.response.text()
            try {
                return JSON.parse(text.replace(/```json|```/g, '').trim())
            } catch {
                throw new AppError(500, 'Failed to parse AI comparison response')
            }
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
        const model = getGeminiPro()

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
        const text = result.response.text()
        try {
            return JSON.parse(text.replace(/```json|```/g, '').trim())
        } catch {
            throw new AppError(500, 'Failed to parse AI description response')
        }
    }

    /** AI Image Analysis (Admin) */
    async analyzeImage(imageBase64: string, mimeType: string) {
        const model = getGeminiPro()

        const result = await model.generateContent([
            {
                inlineData: { mimeType, data: imageBase64 },
            },
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

        const text = result.response.text()
        try {
            return JSON.parse(text.replace(/```json|```/g, '').trim())
        } catch {
            throw new AppError(500, 'Failed to parse AI image analysis')
        }
    }
}

export const aiService = new AIService()
