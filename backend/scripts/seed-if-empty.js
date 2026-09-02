// Seeds the database on first boot only.
//
// Render runs the start command on every deploy, but the SQLite file lives on a
// persistent disk — so re-seeding each time would be wasted work. The seed
// itself is upsert-based and safe to repeat; this guard just skips it once the
// catalog exists.

const { execFileSync } = require('child_process')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

async function main() {
    const prisma = new PrismaClient()
    let count
    try {
        count = await prisma.product.count()
    } finally {
        await prisma.$disconnect()
    }

    if (count > 0) {
        console.log(`⏭️  Seed skipped — ${count} products already in the database`)
        return
    }

    console.log('🌱 Empty database detected — running seed...')

    // Run ts-node's JS entry under the current node binary rather than the
    // .bin shim: Node refuses to spawnSync a .CMD on Windows (EINVAL).
    execFileSync(process.execPath, [require.resolve('ts-node/dist/bin.js'), 'src/prisma/seed.ts'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
    })
}

main().catch((err) => {
    // A failed seed must not keep the API from starting — an empty catalog is
    // recoverable, a crash loop is not.
    console.error('⚠️  Seed failed, starting server anyway:', err.message)
})
