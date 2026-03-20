import app from './app'
import { env } from './config/env'

const PORT = env.PORT

app.listen(PORT, () => {
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
})
