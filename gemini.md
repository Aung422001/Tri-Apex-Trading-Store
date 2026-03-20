# Gemini AI Integration Guide
## Triapex Trading Group — Google Gemini API

---

## 🤖 Setup & Configuration

```typescript
// AI Prompt for VS Code:
// Set up Google Gemini API client in a Node.js TypeScript project.
// Create a singleton GeminiService class with methods for:
// text generation, streaming responses, and vision (image analysis).
// Use @google/generative-ai package. Load API key from env.
// Add error handling for quota limits and content policy blocks.
```

### Installation
```bash
pnpm add @google/generative-ai
```

### Basic Client Setup
```typescript
// backend/src/config/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiPro = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  }
})

export const geminiFlash = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash'  // Use for faster, cheaper responses
})
```

---

## 🎯 Feature Implementations

### 1. AI Product Recommender

```typescript
// AI Prompt:
// Create a product recommendation endpoint POST /api/ai/recommend that:
// 1. Accepts user preferences: { budget: number, useCase: string, experience: string }
//    useCase: "hobby" | "professional" | "industrial" | "education"
//    experience: "beginner" | "intermediate" | "expert"
// 2. Fetches available products from DB (id, name, price, specs summary)
// 3. Sends structured prompt to Gemini with user prefs + product catalog
// 4. Returns top 3 recommended products with explanation for each
// 5. Cache results by preference hash in Redis (TTL: 1 hour)
//
// Prompt template to use:
// "You are a 3D printer expert at Triapex Trading Group. 
//  A customer needs help choosing. Budget: {budget}, Use case: {useCase}, 
//  Experience: {experience}. Available products: {products}.
//  Recommend exactly 3 products. Return JSON: 
//  [{productId, reason, highlights[]}]. No extra text."
```

**Sample Service Code:**
```typescript
export async function getProductRecommendations(
  preferences: UserPreferences,
  products: ProductSummary[]
): Promise<Recommendation[]> {
  const prompt = `
You are an expert 3D printer consultant at Triapex Trading Group.
Help this customer choose the best 3D printer.

Customer Profile:
- Budget: MYR ${preferences.budget}
- Use Case: ${preferences.useCase}
- Experience Level: ${preferences.experience}
- Special Requirements: ${preferences.requirements || 'None'}

Available Products (JSON):
${JSON.stringify(products, null, 2)}

Return ONLY a valid JSON array of exactly 3 recommendations:
[{"productId": "...", "reason": "2-3 sentence explanation", "highlights": ["point1", "point2"]}]
`
  const result = await geminiFlash.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}
```

---

### 2. AI Support Chatbot

```typescript
// AI Prompt:
// Build a streaming chatbot API endpoint POST /api/ai/chat that:
// 1. Maintains conversation history (passed from frontend)
// 2. Has a system context about Triapex products and policies
// 3. Uses Gemini chat session with history
// 4. Streams response chunks using Server-Sent Events (SSE)
// 5. Handles: product questions, order inquiries (look up by order ID), 
//    shipping info, return policy, technical support
// 6. Escalates to human support for complex issues
//
// System prompt:
// "You are Tribot, the helpful AI assistant for Triapex Trading Group,
//  a 3D printer retailer. You help with product info, orders, and technical 
//  support. Be friendly and professional. If asked about specific orders, 
//  ask for the order ID. For technical issues beyond basic troubleshooting, 
//  direct users to support@triapex.com. Keep responses concise."
```

**Frontend Chatbot Widget Prompt:**
```
Create an AI chat widget component (React, TypeScript) for Triapex website:
- Floating button (bottom-right, Triapex orange) that opens a chat drawer
- Chat UI: message bubbles (user right/blue, bot left/gray), typing indicator
- Input box with send button, supports Enter key
- Streams responses from /api/ai/chat using EventSource
- Shows "Tribot 🤖" header with online status indicator
- Persist conversation in sessionStorage
- Add quick reply buttons: "Find a printer", "Track order", "Return policy"
Use shadcn/ui Sheet and scroll-area components.
```

---

### 3. AI Product Description Generator (Admin)

```typescript
// AI Prompt:
// Create an admin feature to auto-generate product descriptions using Gemini:
// Endpoint: POST /api/admin/ai/generate-description
// Input: { productName, brand, specs: {}, category, targetAudience }
// Output: { shortDescription (150 chars), fullDescription (HTML), 
//           seoTitle, metaDescription, highlights: string[] }
//
// Gemini prompt:
// "Write compelling e-commerce copy for a 3D printer product:
//  Product: {name}, Brand: {brand}, Category: {category}
//  Key Specs: {specs}
//  Target: {audience}
//  Provide: 1) Short description (150 chars max), 
//  2) Full HTML description (400-600 words, use <h3>, <ul>, <p>),
//  3) SEO title (60 chars), 4) Meta description (155 chars),
//  5) 5 key highlights as array.
//  Return as JSON only."
```

---

### 4. AI Product Comparison

```typescript
// AI Prompt:
// Create POST /api/ai/compare that takes 2-3 product IDs, fetches their 
// full specs from DB, and uses Gemini to generate:
// - A neutral comparison summary (pros/cons for each)
// - A verdict recommending which is best for different use cases
// - A comparison table data (structured JSON)
// Return as structured JSON for frontend rendering.
```

---

### 5. AI Image Analysis (Product Upload)

```typescript
// AI Prompt:
// Create an admin endpoint POST /api/admin/ai/analyze-image that:
// 1. Accepts a product image (base64 or URL)
// 2. Sends to Gemini Vision (gemini-1.5-pro with image)
// 3. Extracts: product type, visible features, suggested tags, 
//    quality assessment, suggested alt text
// 4. Returns structured JSON for admin to review before saving
//
// Use gemini-1.5-pro model with inline image data:
// { inlineData: { mimeType: "image/jpeg", data: base64string } }
```

---

## 📋 Gemini Rules & Best Practices

```markdown
## Rules for Using Gemini API in This Project

### Model Selection
- Use `gemini-1.5-flash` for: chatbot, quick recommendations, descriptions
- Use `gemini-1.5-pro` for: image analysis, complex comparisons, admin tasks

### Safety Settings
Always configure safety settings to BLOCK_MEDIUM_AND_ABOVE for all categories.
Filter: HARM_CATEGORY_HARASSMENT, HARM_CATEGORY_HATE_SPEECH,
        HARM_CATEGORY_SEXUALLY_EXPLICIT, HARM_CATEGORY_DANGEROUS_CONTENT

### Cost Control
- Cache all non-personalized Gemini responses in Redis (TTL: 1-24 hours)
- Use gemini-flash for all user-facing features (10x cheaper than pro)
- Set maxOutputTokens: 512 for chat, 1024 for descriptions, 2048 for comparisons
- Rate limit: 10 requests/minute per user, 100/minute global

### Prompt Engineering Rules
1. Always instruct model to return JSON only (no markdown, no preamble)
2. Include "Return ONLY valid JSON, no extra text" in every structured prompt
3. Wrap JSON.parse() in try/catch with fallback responses
4. Test prompts with edge cases (empty catalog, unusual preferences)
5. Always include company context: "You are an assistant for Triapex Trading Group"

### Error Handling
- SAFETY_BLOCK → Return "I can't answer that, please contact support"
- QUOTA_EXCEEDED → Return cached fallback or queue for retry
- INVALID_ARGUMENT → Log and return generic helpful message
- Network errors → Retry 3x with exponential backoff

### Privacy
- Never send customer PII (name, email, phone) to Gemini API
- Use customer ID references instead of actual personal data
- Strip all PII from prompts before sending
```

---

## 🔧 Environment Variables Needed

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_FLASH=gemini-1.5-flash
GEMINI_MODEL_PRO=gemini-1.5-pro
GEMINI_MAX_TOKENS=1024
GEMINI_TEMPERATURE=0.7
```

---

## 📊 Gemini API Quota Management

```typescript
// AI Prompt:
// Create a Gemini API rate limiter service using Redis:
// - Track requests per user per minute using Redis INCR + EXPIRE
// - Track daily costs by counting tokens (rough estimate)
// - Alert when daily spend exceeds threshold
// - Implement request queuing with bull-queue for non-urgent tasks
// - Dashboard endpoint GET /api/admin/ai/usage for cost monitoring
```
