import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Adding new brands and products...')

    // Ensure categories exist
    const fdmCat = await prisma.category.upsert({
        where: { slug: 'fdm-printers' },
        update: {},
        create: { name: 'FDM Printers', slug: 'fdm-printers', description: 'Fused Deposition Modeling 3D printers' }
    })
    const resinCat = await prisma.category.upsert({
        where: { slug: 'resin-printers' },
        update: {},
        create: { name: 'Resin Printers', slug: 'resin-printers', description: 'SLA/DLP resin 3D printers' }
    })
    const accessoriesCat = await prisma.category.upsert({
        where: { slug: 'accessories' },
        update: {},
        create: { name: 'Accessories', slug: 'accessories', description: '3D printer parts and accessories' }
    })

    // Add new brands
    const dell = await prisma.brand.upsert({
        where: { slug: 'dell' },
        update: {},
        create: { name: 'Dell', slug: 'dell' }
    })
    const hp = await prisma.brand.upsert({
        where: { slug: 'hp' },
        update: {},
        create: { name: 'HP', slug: 'hp' }
    })
    const raise3d = await prisma.brand.upsert({
        where: { slug: 'raise3d' },
        update: {},
        create: { name: 'Raise3D', slug: 'raise3d' }
    })
    console.log('✅ Brands added: Dell, HP, Raise3D')

    // New products
    const newProducts = [
        // --- HP Products ---
        {
            name: 'HP Jet Fusion 580 Color',
            slug: 'hp-jet-fusion-580-color',
            shortDescription: 'Full-color professional MJF 3D printer for office environments',
            description: '<h3>Industrial Color 3D Printing for the Office</h3><p>The HP Jet Fusion 580 Color brings industrial Multi Jet Fusion technology to the office. Print functional parts in full color with exceptional isotropic mechanical properties.</p><ul><li>Full-color 3D printing capability</li><li>Voxel-level material control</li><li>Up to 10x faster than SLS printers</li><li>PA 12 material compatible</li></ul>',
            price: 89000,
            comparePrice: 95000,
            stock: 5,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '332 x 190 x 248mm',
            resolution: '0.08mm',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { technology: 'Multi Jet Fusion', material: 'PA 12 CB', weight: '193kg', powerConsumption: '2200W', colorCapable: 'Yes' },
            categoryId: fdmCat.id,
            brandId: hp.id,
            sku: 'HP-JF580C',
        },
        {
            name: 'HP Jet Fusion 5200 Series',
            slug: 'hp-jet-fusion-5200',
            shortDescription: 'Industrial-grade MJF printer for high-volume production',
            description: '<h3>Production-Ready Industrial 3D Printing</h3><p>The HP Jet Fusion 5200 is designed for high-volume production with the lowest cost per part at scale. Produce functional parts with consistent quality batch after batch.</p><ul><li>Up to 100L/hr build speed</li><li>99% powder reusability</li><li>Automated post-processing compatible</li><li>Remote monitoring via HP SmartStream</li></ul>',
            price: 245000,
            stock: 3,
            featured: false,
            printTechnology: 'FDM' as const,
            buildVolume: '380 x 284 x 380mm',
            resolution: '0.08mm',
            connectivity: 'LAN, Wi-Fi',
            specs: { technology: 'Multi Jet Fusion', material: 'PA 12, PA 11, TPU', weight: '1360kg', powerConsumption: '30kW', production: 'High Volume' },
            categoryId: fdmCat.id,
            brandId: hp.id,
            sku: 'HP-JF5200',
        },
        {
            name: 'HP Designjet 3D Starter Kit',
            slug: 'hp-designjet-3d-starter-kit',
            shortDescription: 'Complete HP 3D printing starter bundle with software & materials',
            description: '<p>Everything you need to start 3D printing with HP technology. Includes HP 3D software suite, 2kg PA12 material cartridge, post-processing tools, and 1-year onsite warranty support.</p>',
            price: 12500,
            comparePrice: 14000,
            stock: 20,
            printTechnology: 'FDM' as const,
            specs: { includes: 'Software + 2kg Material + Tools', warranty: '1 Year Onsite', support: 'HP Certified' },
            categoryId: accessoriesCat.id,
            brandId: hp.id,
            sku: 'HP-3D-STARTER',
        },

        // --- Dell Products ---
        {
            name: 'Dell Dimension 3D Pro X500',
            slug: 'dell-dimension-3d-pro-x500',
            shortDescription: 'Dell-engineered precision FDM printer for professionals',
            description: '<h3>Precision Engineering Meets Reliability</h3><p>The Dell Dimension 3D Pro X500 combines Dell\'s legendary build quality with advanced FDM printing technology. Designed for engineers, architects, and design professionals who demand accuracy and reliability.</p><ul><li>Dell Precision motion control system</li><li>Dual-extruder for support materials</li><li>Heated enclosure for warp-free prints</li><li>Dell Command software integration</li></ul>',
            price: 15500,
            comparePrice: 17000,
            stock: 8,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '300 x 300 x 350mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, Ethernet, USB-C',
            specs: { extruders: 'Dual', nozzleTemp: '320°C', bedTemp: '130°C', filamentDiameter: '1.75mm', weight: '28kg', enclosure: 'Heated' },
            categoryId: fdmCat.id,
            brandId: dell.id,
            sku: 'DELL-DIM3D-X500',
        },
        {
            name: 'Dell Dimension 3D Resin R200',
            slug: 'dell-dimension-3d-resin-r200',
            shortDescription: '8K MSLA resin printer with Dell precision LCD system',
            description: '<h3>Ultra-High Resolution Resin Printing</h3><p>The Dell Dimension 3D Resin R200 features an 8K mono LCD screen with Dell\'s proprietary precision backlight for sharp, consistent UV exposure across the entire build plate.</p><ul><li>8K mono LCD: 7680 x 4320 pixels</li><li>Dell SmartExposure calibration</li><li>Tilt-release FEP system</li><li>Compatible with all open-source resins</li></ul>',
            price: 8900,
            comparePrice: 9900,
            stock: 12,
            featured: true,
            printTechnology: 'SLA' as const,
            buildVolume: '240 x 135 x 260mm',
            resolution: '0.022mm XY',
            connectivity: 'Wi-Fi, USB',
            specs: { lcdResolution: '7680 x 4320 (8K)', lightSource: '40W UV LED', exposureTime: '1.5s', weight: '12.5kg' },
            categoryId: resinCat.id,
            brandId: dell.id,
            sku: 'DELL-DIM3D-R200',
        },
        {
            name: 'Dell 3D Print Care Pack — 3 Year',
            slug: 'dell-3d-print-care-pack-3yr',
            shortDescription: 'Extended 3-year onsite warranty and technical support for Dell 3D printers',
            description: '<p>Dell\'s comprehensive Care Pack provides 3 years of onsite hardware support, priority technical assistance, and preventive maintenance for your Dell 3D printer. Includes annual calibration service and parts coverage.</p>',
            price: 3200,
            stock: 50,
            specs: { coverage: '3 Years Onsite', includes: 'Parts + Labor + Annual Calibration', responseTime: 'Next Business Day' },
            categoryId: accessoriesCat.id,
            brandId: dell.id,
            sku: 'DELL-CARE3D-3YR',
        },

        // --- Raise3D Products ---
        {
            name: 'Raise3D Pro3 Plus',
            slug: 'raise3d-pro3-plus',
            shortDescription: 'Large-format industrial dual-extruder FDM printer',
            description: '<h3>Professional Dual Extrusion at Scale</h3><p>The Raise3D Pro3 Plus is designed for demanding industrial environments. Its large build volume and IDEX (Independent Dual Extruder) system enable complex multi-material prints with soluble support structures.</p><ul><li>IDEX dual extruder system</li><li>600 x 600 x 700mm build volume</li><li>All-metal hot end up to 300°C</li><li>Enclosed with HEPA + carbon filter</li></ul>',
            price: 39500,
            comparePrice: 42000,
            stock: 4,
            featured: true,
            printTechnology: 'FDM' as const,
            buildVolume: '600 x 600 x 700mm',
            resolution: '0.01mm',
            connectivity: 'Wi-Fi, Ethernet, USB',
            specs: { extruders: 'IDEX Dual', nozzleTemp: '300°C', bedTemp: '120°C', filtration: 'HEPA + Carbon', weight: '62kg' },
            categoryId: fdmCat.id,
            brandId: raise3d.id,
            sku: 'R3D-PRO3-PLUS',
        },
        {
            name: 'Raise3D E2CF',
            slug: 'raise3d-e2cf',
            shortDescription: 'Carbon fiber optimized dual extruder desktop printer',
            description: '<h3>Built for Carbon Fiber & Engineering Materials</h3><p>The Raise3D E2CF is specifically engineered for carbon fiber reinforced and other abrasive engineering materials. Hardened nozzles, enclosed build chamber, and precise temperature control make it ideal for demanding applications.</p><ul><li>Optimized for CF-PA, CF-PET, CF-PLA</li><li>Hardened stainless steel nozzles included</li><li>Online monitoring with RaiseCare</li></ul>',
            price: 22000,
            stock: 6,
            featured: false,
            printTechnology: 'FDM' as const,
            buildVolume: '330 x 240 x 240mm',
            resolution: '0.01mm',
            connectivity: 'Wi-Fi, Ethernet, USB',
            specs: { extruders: 'Dual IDEX', nozzleTemp: '300°C', bedTemp: '110°C', materials: 'CF composites, PA, PET, ABS', weight: '28kg' },
            categoryId: fdmCat.id,
            brandId: raise3d.id,
            sku: 'R3D-E2CF',
        },
    ]

    // Product image map
    const productImages: Record<string, { url: string; alt: string }[]> = {
        'hp-jet-fusion-580-color': [
            { url: 'https://placehold.co/800x800/0096D6/ffffff?text=HP+Jet+Fusion+580+Color', alt: 'HP Jet Fusion 580 Color 3D Printer' },
            { url: 'https://placehold.co/800x800/00A4EF/ffffff?text=HP+MJF+Full+Color', alt: 'HP Jet Fusion 580 Full Color Output' },
        ],
        'hp-jet-fusion-5200': [
            { url: 'https://placehold.co/800x800/0096D6/ffffff?text=HP+Jet+Fusion+5200', alt: 'HP Jet Fusion 5200 Series' },
            { url: 'https://placehold.co/800x800/005B8E/ffffff?text=HP+5200+Industrial', alt: 'HP Jet Fusion 5200 Industrial View' },
        ],
        'hp-designjet-3d-starter-kit': [
            { url: 'https://placehold.co/800x800/00A4EF/ffffff?text=HP+3D+Starter+Kit', alt: 'HP 3D Printing Starter Kit' },
        ],
        'dell-dimension-3d-pro-x500': [
            { url: 'https://placehold.co/800x800/007DB8/ffffff?text=Dell+Dimension+3D+X500', alt: 'Dell Dimension 3D Pro X500' },
            { url: 'https://placehold.co/800x800/004B87/ffffff?text=Dell+3D+X500+Interior', alt: 'Dell Dimension 3D Pro X500 Build Chamber' },
        ],
        'dell-dimension-3d-resin-r200': [
            { url: 'https://placehold.co/800x800/004B87/ffffff?text=Dell+Dimension+3D+R200', alt: 'Dell Dimension 3D Resin R200' },
            { url: 'https://placehold.co/800x800/007DB8/ffffff?text=Dell+R200+8K+Resin', alt: 'Dell Dimension 3D Resin R200 Screen' },
        ],
        'dell-3d-print-care-pack-3yr': [
            { url: 'https://placehold.co/800x800/1E3A5F/ffffff?text=Dell+3D+Care+Pack%0A3+Years', alt: 'Dell 3D Print Care Pack 3 Year' },
        ],
        'raise3d-pro3-plus': [
            { url: 'https://placehold.co/800x800/E8761A/ffffff?text=Raise3D+Pro3+Plus', alt: 'Raise3D Pro3 Plus Large Format Printer' },
            { url: 'https://placehold.co/800x800/CC5500/ffffff?text=Pro3+Plus+IDEX+Dual', alt: 'Raise3D Pro3 Plus IDEX System' },
        ],
        'raise3d-e2cf': [
            { url: 'https://placehold.co/800x800/333333/ffffff?text=Raise3D+E2CF', alt: 'Raise3D E2CF Carbon Fiber Printer' },
            { url: 'https://placehold.co/800x800/E8761A/ffffff?text=E2CF+Carbon+Fiber', alt: 'Raise3D E2CF Carbon Fiber Build' },
        ],
    }

    for (const productData of newProducts) {
        const { specs, ...rest } = productData
        const dataToSave = {
            ...rest,
            specs: specs ? JSON.stringify(specs) : undefined,
        } as any

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

        console.log(`✅ Product added: ${productData.name}`)
    }

    console.log('\n🎉 Done! Added:')
    console.log('  🔵 HP    — Jet Fusion 580 Color, Jet Fusion 5200, Designjet Starter Kit')
    console.log('  🔵 Dell  — Dimension 3D Pro X500, Dimension 3D Resin R200, Care Pack 3yr')
    console.log('  🟠 Raise3D — Pro3 Plus, E2CF')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
