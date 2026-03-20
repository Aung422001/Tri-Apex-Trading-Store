import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('ChangeThisPassword123!', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@triapextrading.com' },
        update: {},
        create: {
            email: 'admin@triapextrading.com',
            name: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
            emailVerified: true,
            cart: { create: {} },
        },
    })
    console.log('✅ Admin user created:', admin.email)

    // Create demo user
    const userPassword = await bcrypt.hash('User12345!', 12)
    const user = await prisma.user.upsert({
        where: { email: 'demo@triapextrading.com' },
        update: {},
        create: {
            email: 'demo@triapextrading.com',
            name: 'Demo User',
            password: userPassword,
            role: 'USER',
            emailVerified: true,
            cart: { create: {} },
        },
    })
    console.log('✅ Demo user created:', user.email)

    // Create the Fighter user
    const fighter = await prisma.user.upsert({
        where: { email: 'fighter422001@gmail.com' },
        update: {},
        create: {
            email: 'fighter422001@gmail.com',
            name: 'Fighter User',
            password: userPassword,
            role: 'USER',
            emailVerified: true,
            cart: { create: {} },
        },
    })
    console.log('✅ Fighter user created:', fighter.email)

    // Create brands
    const brands = await Promise.all([
        prisma.brand.upsert({ where: { slug: 'creality' }, update: {}, create: { name: 'Creality', slug: 'creality' } }),
        prisma.brand.upsert({ where: { slug: 'prusa' }, update: {}, create: { name: 'Prusa Research', slug: 'prusa' } }),
        prisma.brand.upsert({ where: { slug: 'bambu-lab' }, update: {}, create: { name: 'Bambu Lab', slug: 'bambu-lab' } }),
        prisma.brand.upsert({ where: { slug: 'anycubic' }, update: {}, create: { name: 'Anycubic', slug: 'anycubic' } }),
        prisma.brand.upsert({ where: { slug: 'elegoo' }, update: {}, create: { name: 'Elegoo', slug: 'elegoo' } }),
        prisma.brand.upsert({ where: { slug: 'flashforge' }, update: {}, create: { name: 'FlashForge', slug: 'flashforge' } }),
    ])
    console.log('✅ Brands created:', brands.length)

    // Create categories
    const fdmCat = await prisma.category.upsert({ where: { slug: 'fdm-printers' }, update: {}, create: { name: 'FDM Printers', slug: 'fdm-printers', description: 'Fused Deposition Modeling 3D printers' } })
    const resinCat = await prisma.category.upsert({ where: { slug: 'resin-printers' }, update: {}, create: { name: 'Resin Printers', slug: 'resin-printers', description: 'SLA/DLP resin 3D printers' } })
    const filamentCat = await prisma.category.upsert({ where: { slug: 'filaments' }, update: {}, create: { name: 'Filaments', slug: 'filaments', description: '3D printing filaments and materials' } })
    const accessoriesCat = await prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories', description: '3D printer parts and accessories' } })
    console.log('✅ Categories created')

    // Create products
    const products = [
        {
            name: 'Bambu Lab X1 Carbon Combo',
            slug: 'bambu-lab-x1-carbon-combo',
            shortDescription: 'High-speed CoreXY 3D printer with multi-color AMS system',
            description: '<h3>Ultimate Speed & Precision</h3><p>The Bambu Lab X1 Carbon is a flagship CoreXY FDM 3D printer that delivers exceptional speed and quality. With its advanced multi-color AMS system, you can print in up to 16 colors automatically.</p><ul><li>Up to 500mm/s printing speed</li><li>Hardened steel nozzle for abrasive materials</li><li>AI-powered first layer inspection</li><li>Built-in camera for remote monitoring</li></ul>',
            price: 6899,
            comparePrice: 7499,
            stock: 15,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '256 x 256 x 256mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, LAN',
            specs: { nozzleTemp: '300°C', bedTemp: '120°C', nozzleDiameter: '0.4mm', filamentDiameter: '1.75mm', weight: '14.13kg' },
            categoryId: fdmCat.id,
            brandId: brands[2].id,
            sku: 'BL-X1C-COMBO',
        },
        {
            name: 'Bambu Lab P1S Combo',
            slug: 'bambu-lab-p1s-combo',
            shortDescription: 'Enclosed high-speed FDM printer with AMS',
            description: '<p>The P1S is a fully enclosed printer built for reliability and speed. Perfect for printing engineering-grade materials.</p>',
            price: 3599,
            comparePrice: 3999,
            stock: 25,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '256 x 256 x 256mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, LAN',
            specs: { nozzleTemp: '300°C', bedTemp: '100°C', weight: '12.6kg' },
            categoryId: fdmCat.id,
            brandId: brands[2].id,
            sku: 'BL-P1S-COMBO',
        },
        {
            name: 'Creality Ender-3 V3 SE',
            slug: 'creality-ender-3-v3-se',
            shortDescription: 'Budget-friendly auto-leveling FDM printer perfect for beginners',
            description: '<p>The Ender-3 V3 SE brings auto-leveling, direct drive extruder, and a strain gauge sensor to the budget segment.</p>',
            price: 899,
            comparePrice: 1099,
            stock: 50,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '220 x 220 x 250mm',
            resolution: '0.1mm',
            connectivity: 'USB, SD Card',
            specs: { nozzleTemp: '260°C', bedTemp: '100°C', weight: '7.76kg' },
            categoryId: fdmCat.id,
            brandId: brands[0].id,
            sku: 'CR-E3V3SE',
        },
        {
            name: 'Creality K1 Max',
            slug: 'creality-k1-max',
            shortDescription: 'Large format high-speed CoreXY printer with AI camera',
            description: '<p>The K1 Max offers a generous 300x300x300mm build volume with speeds up to 600mm/s and AI-powered monitoring.</p>',
            price: 3299,
            stock: 20,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '300 x 300 x 300mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, USB',
            specs: { nozzleTemp: '300°C', bedTemp: '120°C', weight: '18kg' },
            categoryId: fdmCat.id,
            brandId: brands[0].id,
            sku: 'CR-K1MAX',
        },
        {
            name: 'Prusa MK4S',
            slug: 'prusa-mk4s',
            shortDescription: 'Legendary reliability with Input Shaper and Pressure Advance',
            description: '<p>The Prusa MK4S continues the legacy of the best-selling MK series with improved speed, auto-leveling, and load cell sensor for perfect first layers.</p>',
            price: 3899,
            stock: 12,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '250 x 210 x 220mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, USB, LAN',
            specs: { nozzleTemp: '300°C', bedTemp: '120°C', weight: '7kg' },
            categoryId: fdmCat.id,
            brandId: brands[1].id,
            sku: 'PR-MK4S',
        },
        {
            name: 'Elegoo Saturn 4 Ultra',
            slug: 'elegoo-saturn-4-ultra',
            shortDescription: '12K resolution resin printer for ultra-detailed miniatures',
            description: '<p>The Saturn 4 Ultra delivers breathtaking 12K resolution prints with Elegoo\'s proprietary light source for faster and sharper prints.</p>',
            price: 2399,
            stock: 18,
            featured: true,
            printTechnology: 'SLA' as const,
            buildVolume: '218.88 x 122.88 x 220mm',
            resolution: '0.019mm XY',
            connectivity: 'Wi-Fi, USB',
            specs: { lightSource: '36W COB', lcdResolution: '11520 x 5120', weight: '11kg' },
            categoryId: resinCat.id,
            brandId: brands[4].id,
            sku: 'EL-SAT4U',
        },
        {
            name: 'Anycubic Photon Mono M7 Pro',
            slug: 'anycubic-photon-mono-m7-pro',
            shortDescription: '14K high-res resin printer with smart anti-aliasing',
            description: '<p>The Photon Mono M7 Pro pushes resin printing boundaries with its 14K screen resolution for unmatched detail.</p>',
            price: 2199,
            stock: 14,
            printTechnology: 'SLA' as const,
            buildVolume: '222.72 x 126 x 245mm',
            resolution: '0.017mm XY',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { lightSource: '48W COB', weight: '10.5kg' },
            categoryId: resinCat.id,
            brandId: brands[3].id,
            sku: 'AC-PMM7P',
        },
        {
            name: 'eSUN PLA+ Filament 1kg — Black',
            slug: 'esun-pla-plus-black-1kg',
            shortDescription: 'Premium PLA+ filament with excellent layer adhesion',
            description: '<p>eSUN PLA+ is a enhanced PLA with improved toughness, strength, and layer adhesion. Perfect for functional prints.</p>',
            price: 79,
            comparePrice: 99,
            stock: 200,
            printTechnology: 'FDM' as const,
            specs: { material: 'PLA+', diameter: '1.75mm', weight: '1kg', printTemp: '205-225°C', bedTemp: '60°C' },
            categoryId: filamentCat.id,
            sku: 'ES-PLA-BK-1KG',
        },
        {
            name: 'Bambu Lab PLA Basic 1kg — Multi Pack',
            slug: 'bambu-lab-pla-basic-multipack',
            shortDescription: 'Bambu Lab certified PLA in 8 vibrant colors',
            description: '<p>Official Bambu Lab PLA filament optimized for Bambu printers. Excellent surface quality and consistent diameter.</p>',
            price: 189,
            stock: 80,
            printTechnology: 'FDM' as const,
            specs: { material: 'PLA', diameter: '1.75mm', weight: '1kg x 8', colors: '8 assorted' },
            categoryId: filamentCat.id,
            brandId: brands[2].id,
            sku: 'BL-PLA-MULTI',
        },
        {
            name: 'Hardened Steel Nozzle Set (0.4/0.6/0.8mm)',
            slug: 'hardened-steel-nozzle-set',
            shortDescription: 'Durable nozzles for abrasive filaments like carbon fiber and glow-in-dark',
            description: '<p>Set of 3 hardened steel nozzles compatible with most Creality and Bambu Lab printers. Essential for printing with abrasive materials.</p>',
            price: 49,
            stock: 100,
            specs: { material: 'Hardened Steel', sizes: '0.4mm, 0.6mm, 0.8mm', compatibility: 'MK8 style' },
            categoryId: accessoriesCat.id,
            sku: 'ACC-HS-NOZZLE-SET',
        },
        {
            name: 'PEI Spring Steel Build Plate 256x256mm',
            slug: 'pei-spring-steel-build-plate-256',
            shortDescription: 'Double-sided PEI textured/smooth build plate',
            description: '<p>Premium PEI-coated spring steel build plate. Textured side for PETG/ABS adhesion, smooth side for glossy PLA prints.</p>',
            price: 89,
            stock: 60,
            specs: { size: '256 x 256mm', material: 'PEI-coated Spring Steel', sides: 'Textured + Smooth' },
            categoryId: accessoriesCat.id,
            sku: 'ACC-PEI-256',
        },
        {
            name: 'FlashForge Adventurer 5M Pro',
            slug: 'flashforge-adventurer-5m-pro',
            shortDescription: 'Fast enclosed printer with vibration compensation',
            description: '<p>The Adventurer 5M Pro offers 600mm/s speed in a fully enclosed design. Perfect for schools and workshops.</p>',
            price: 2499,
            stock: 10,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '220 x 220 x 220mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, USB, LAN',
            specs: { nozzleTemp: '280°C', bedTemp: '110°C', weight: '13.5kg' },
            categoryId: fdmCat.id,
            brandId: brands[5].id,
            sku: 'FF-ADV5MP',
        },
    ]

    // Product images map (slug -> image URLs)
    const productImages: Record<string, { url: string; alt: string }[]> = {
        'bambu-lab-x1-carbon-combo': [
            { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80', alt: 'Bambu Lab X1 Carbon with AMS' },
            { url: 'https://images.unsplash.com/photo-1595344916836-e2b67b69d1c6?w=800&q=80', alt: 'Bambu Lab X1 Carbon Print' },
        ],
        'bambu-lab-p1s-combo': [
            { url: 'https://images.unsplash.com/photo-1631282715603-d4180e58f5ea?w=800&q=80', alt: 'Bambu Lab P1S with AMS' },
            { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80', alt: 'Bambu Lab P1S Front View' },
        ],
        'creality-ender-3-v3-se': [
            { url: 'https://images.unsplash.com/photo-1563520240-bae9cfe29b7c?w=800&q=80', alt: 'Creality Ender-3 V3 SE' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Creality Ender-3 V3 SE Printing' },
        ],
        'creality-k1-max': [
            { url: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80', alt: 'Creality K1 Max' },
            { url: 'https://images.unsplash.com/photo-1563520240-bae9cfe29b7c?w=800&q=80', alt: 'Creality K1 Max Large Build' },
        ],
        'prusa-mk4s': [
            { url: 'https://images.unsplash.com/photo-1595344916836-e2b67b69d1c6?w=800&q=80', alt: 'Prusa MK4S' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Prusa MK4S Side View' },
        ],
        'elegoo-saturn-4-ultra': [
            { url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80', alt: 'Elegoo Saturn 4 Ultra Resin Printer' },
            { url: 'https://images.unsplash.com/photo-1631282715603-d4180e58f5ea?w=800&q=80', alt: 'Elegoo Saturn 4 Ultra Screen' },
        ],
        'anycubic-photon-mono-m7-pro': [
            { url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80', alt: 'Anycubic Photon Mono M7 Pro' },
            { url: 'https://images.unsplash.com/photo-1631282715603-d4180e58f5ea?w=800&q=80', alt: 'Anycubic Photon Mono M7 Pro Detail' },
        ],
        'esun-pla-plus-black-1kg': [
            { url: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80', alt: 'eSUN PLA+ Black 1kg Filament' },
        ],
        'bambu-lab-pla-basic-multipack': [
            { url: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80', alt: 'Bambu Lab PLA Basic Multipack' },
        ],
        'hardened-steel-nozzle-set': [
            { url: 'https://images.unsplash.com/photo-1581092921461-eab10380ed66?w=800&q=80', alt: 'Hardened Steel Nozzle Set' },
        ],
        'pei-spring-steel-build-plate-256': [
            { url: 'https://images.unsplash.com/photo-1581092921461-eab10380ed66?w=800&q=80', alt: 'PEI Spring Steel Build Plate' },
        ],
        'flashforge-adventurer-5m-pro': [
            { url: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80', alt: 'FlashForge Adventurer 5M Pro' },
            { url: 'https://images.unsplash.com/photo-1595344916836-e2b67b69d1c6?w=800&q=80', alt: 'FlashForge Adventurer 5M Pro Interior' },
        ],
    }

    for (const productData of products) {
        const dataToSave = {
            ...productData,
            specs: productData.specs ? JSON.stringify(productData.specs) : undefined
        } as any;

        const product = await prisma.product.upsert({
            where: { slug: productData.slug },
            update: dataToSave,
            create: dataToSave,
        })

        // Add images if not already present
        const existingImages = await prisma.productImage.findMany({ where: { productId: product.id } })
        if (existingImages.length === 0 && productImages[productData.slug]) {
            await prisma.productImage.createMany({
                data: productImages[productData.slug].map((img, idx) => ({
                    url: img.url,
                    alt: img.alt,
                    position: idx,
                    productId: product.id,
                }))
            })
        }
    }
    console.log('✅ Products created:', products.length)

    // Create coupons
    await prisma.coupon.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: { code: 'WELCOME10', description: '10% off your first order', discountPercent: 10, maxUses: 1000, expiresAt: new Date('2027-12-31') },
    })
    await prisma.coupon.upsert({
        where: { code: 'FREESHIP' },
        update: {},
        create: { code: 'FREESHIP', description: 'Free shipping on orders over MMK 200', discountAmount: 15, minOrderAmount: 200, maxUses: 500 },
    })
    console.log('✅ Coupons created')

    // Create sample address
    await prisma.address.create({
        data: {
            userId: user.id,
            label: 'Home',
            fullName: 'Demo User',
            phone: '+60123456789',
            street: '123 Jalan Bukit Bintang',
            city: 'Kuala Lumpur',
            state: 'Wilayah Persekutuan',
            postalCode: '55100',
            country: 'Malaysia',
            isDefault: true,
        },
    }).catch(() => { }) // Ignore if already exists

    console.log('✅ Sample address created')

    // Create blog posts
    await prisma.blogPost.upsert({
        where: { slug: 'beginners-guide-to-3d-printing' },
        update: {},
        create: {
            title: 'Beginners Guide to 3D Printing',
            slug: 'beginners-guide-to-3d-printing',
            excerpt: 'Everything you need to know to get started with 3D printing, from choosing your first printer to making your first print.',
            content: '<h2>Getting Started with 3D Printing</h2><p>3D printing has become more accessible than ever. In this guide, we will walk you through everything you need to know...</p>',
            published: true,
            authorId: admin.id,
        },
    })
    await prisma.blogPost.upsert({
        where: { slug: 'fdm-vs-resin-which-is-right-for-you' },
        update: {},
        create: {
            title: 'FDM vs Resin: Which is Right for You?',
            slug: 'fdm-vs-resin-which-is-right-for-you',
            excerpt: 'Understanding the differences between FDM and resin 3D printing technologies to make the right purchase decision.',
            content: '<h2>FDM vs Resin Printing</h2><p>Two of the most popular 3D printing technologies are FDM (Fused Deposition Modeling) and resin (SLA/DLP)...</p>',
            published: true,
            authorId: admin.id,
        },
    })
    console.log('✅ Blog posts created')

    console.log('\n🎉 Seed complete!')
    console.log('  Admin: admin@triapextrading.com / ChangeThisPassword123!')
    console.log('  User:  demo@triapextrading.com / User12345!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
