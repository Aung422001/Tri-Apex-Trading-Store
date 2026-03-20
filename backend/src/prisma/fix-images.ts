import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// All product images use placehold.co - guaranteed to load, branded colors
const imageUpdates: Record<string, { url: string; alt: string }[]> = {
    'bambu-lab-x1-carbon-combo': [
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Bambu+Lab+X1+Carbon', alt: 'Bambu Lab X1 Carbon Combo' },
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=X1+Carbon+%2B+AMS', alt: 'Bambu Lab X1 Carbon with AMS' },
    ],
    'bambu-lab-p1s-combo': [
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Bambu+Lab+P1S', alt: 'Bambu Lab P1S Combo' },
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=P1S+%2B+AMS', alt: 'Bambu Lab P1S with AMS' },
    ],
    'creality-ender-3-v3-se': [
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Creality+Ender-3+V3+SE', alt: 'Creality Ender-3 V3 SE' },
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=Ender-3+V3+SE+Auto-Level', alt: 'Creality Ender-3 V3 SE Auto-Leveling' },
    ],
    'creality-k1-max': [
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Creality+K1+Max', alt: 'Creality K1 Max' },
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=K1+Max+300x300x300mm', alt: 'Creality K1 Max Large Format' },
    ],
    'prusa-mk4s': [
        { url: 'https://placehold.co/800x800/FF5900/ffffff?text=Prusa+MK4S', alt: 'Prusa MK4S' },
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Prusa+MK4S+Input+Shaper', alt: 'Prusa MK4S Side View' },
    ],
    'elegoo-saturn-4-ultra': [
        { url: 'https://placehold.co/800x800/220044/ffffff?text=Elegoo+Saturn+4+Ultra', alt: 'Elegoo Saturn 4 Ultra Resin Printer' },
        { url: 'https://placehold.co/800x800/440088/ffffff?text=Saturn+4+Ultra+12K', alt: 'Elegoo Saturn 4 Ultra 12K' },
    ],
    'anycubic-photon-mono-m7-pro': [
        { url: 'https://placehold.co/800x800/003366/ffffff?text=Anycubic+Photon+M7+Pro', alt: 'Anycubic Photon Mono M7 Pro' },
        { url: 'https://placehold.co/800x800/005599/ffffff?text=Photon+M7+Pro+14K', alt: 'Anycubic Photon Mono M7 Pro 14K' },
    ],
    'esun-pla-plus-black-1kg': [
        { url: 'https://placehold.co/800x800/111111/ffffff?text=eSUN+PLA%2B+Black+1kg', alt: 'eSUN PLA+ Black 1kg Filament' },
    ],
    'bambu-lab-pla-basic-multipack': [
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=Bambu+PLA+8-Color+Pack', alt: 'Bambu Lab PLA Basic Multipack' },
    ],
    'hardened-steel-nozzle-set': [
        { url: 'https://placehold.co/800x800/555555/ffffff?text=Hardened+Steel+Nozzle+Set%0A0.4+%2F+0.6+%2F+0.8mm', alt: 'Hardened Steel Nozzle Set' },
    ],
    'pei-spring-steel-build-plate-256': [
        { url: 'https://placehold.co/800x800/444444/ffffff?text=PEI+Spring+Steel+Plate%0A256x256mm', alt: 'PEI Spring Steel Build Plate 256mm' },
    ],
    'flashforge-adventurer-5m-pro': [
        { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=FlashForge%0AAdventurer+5M+Pro', alt: 'FlashForge Adventurer 5M Pro' },
        { url: 'https://placehold.co/800x800/E8761A/ffffff?text=Adventurer+5M+Pro%0A600mm%2Fs', alt: 'FlashForge Adventurer 5M Pro Speed' },
    ],
}

async function main() {
    console.log('🔄 Cleaning up database...')

    // Delete bogus "Test Printer X1" product
    const testPrinter = await prisma.product.findFirst({ where: { name: { contains: 'Test Printer' } } })
    if (testPrinter) {
        await prisma.productImage.deleteMany({ where: { productId: testPrinter.id } })
        await prisma.cartItem.deleteMany({ where: { productId: testPrinter.id } })
        await prisma.wishlist.deleteMany({ where: { productId: testPrinter.id } })
        await prisma.review.deleteMany({ where: { productId: testPrinter.id } })
        await prisma.product.delete({ where: { id: testPrinter.id } })
        console.log('🗑️  Deleted bogus product: Test Printer X1')
    }

    console.log('\n🔄 Updating product images...')

    for (const [slug, images] of Object.entries(imageUpdates)) {
        const product = await prisma.product.findUnique({ where: { slug } })
        if (!product) {
            console.log(`⚠️  Product not found: ${slug}`)
            continue
        }

        // Delete existing images and replace
        await prisma.productImage.deleteMany({ where: { productId: product.id } })
        await prisma.productImage.createMany({
            data: images.map((img, idx) => ({
                url: img.url,
                alt: img.alt,
                position: idx,
                productId: product.id,
            }))
        })

        console.log(`✅ Updated images for: ${slug}`)
    }

    console.log('\n🎉 All done!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
