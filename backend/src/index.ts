import app from './app'
import { env } from './config/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

async function runStartupDiagnostics() {
    // Check Anthropic (used for chat)
    if (!env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
        console.log('⚠️  ANTHROPIC_API_KEY not configured — AI chat will return an offline message')
    } else {
        console.log('✅ Anthropic API key configured — AI chat is enabled')
    }

    // Check Gemini (used for recommendations, compare, descriptions)
    if (!env.GEMINI_API_KEY) {
        console.log('⚠️  GEMINI_API_KEY not configured — Gemini features disabled')
        return
    }

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    // Dedupe: flash and pro are often pointed at the same model, and each probe
    // is a real billed request on every boot.
    const modelsToTest = [...new Set([env.GEMINI_MODEL_FLASH, env.GEMINI_MODEL_PRO])]
    for (const m of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: m })
            await model.generateContent('ping')
            console.log(`✅ Gemini model "${m}" is reachable`)
        } catch (err: any) {
            console.log(`⚠️  Gemini model "${m}" failed: ${err.message?.split('\n')[0]}`)
        }
    }
}

const PORT = env.PORT

app.listen(PORT, async () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🖨️  Triapex Trading Group API Server       ║
  ║──────────────────────────────────────────────║
  ║   Port:     ${PORT}                              ║
  ║   Mode:     ${env.NODE_ENV.padEnd(30)}║
  ║   API:      ${(env.API_URL + env.API_PREFIX).padEnd(30)}║
  ║   Health:   ${(env.API_URL + '/health').padEnd(30)}║
  ╚══════════════════════════════════════════════╝
  `)
    await runStartupDiagnostics()
})
