import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMG = {
    fdm1: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&auto=format&fit=crop&q=80',
    fdm2: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=80',
    fdm3: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format&fit=crop&q=80',
    fdm4: 'https://images.unsplash.com/photo-1612198273689-c5b3c9d2d46e?w=800&auto=format&fit=crop&q=80',
    fdm5: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=800&auto=format&fit=crop&q=80',
    fdm6: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&auto=format&fit=crop&q=80',
    resin1: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop&q=80',
    resin2: 'https://images.unsplash.com/photo-1631282715603-d4180e58f5ea?w=800&auto=format&fit=crop&q=80',
    filament: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&auto=format&fit=crop&q=80',
    acc: 'https://images.unsplash.com/photo-1581092921461-eab10380ed66?w=800&auto=format&fit=crop&q=80',
}

async function main() {
    console.log('🌱 Adding more brands and products...')

    const fdmCat = await prisma.category.upsert({ where: { slug: 'fdm-printers' }, update: {}, create: { name: 'FDM Printers', slug: 'fdm-printers', description: 'Fused Deposition Modeling 3D printers' } })
    const resinCat = await prisma.category.upsert({ where: { slug: 'resin-printers' }, update: {}, create: { name: 'Resin Printers', slug: 'resin-printers', description: 'SLA/DLP resin 3D printers' } })
    const filamentCat = await prisma.category.upsert({ where: { slug: 'filaments' }, update: {}, create: { name: 'Filaments', slug: 'filaments', description: '3D printing filaments and materials' } })
    const accCat = await prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories', description: '3D printer parts and accessories' } })

    // Brands
    const canon = await prisma.brand.upsert({ where: { slug: 'canon' }, update: {}, create: { name: 'Canon', slug: 'canon' } })
    const formlabs = await prisma.brand.upsert({ where: { slug: 'formlabs' }, update: {}, create: { name: 'Formlabs', slug: 'formlabs' } })
    const ultimaker = await prisma.brand.upsert({ where: { slug: 'ultimaker' }, update: {}, create: { name: 'Ultimaker', slug: 'ultimaker' } })
    const makerbot = await prisma.brand.upsert({ where: { slug: 'makerbot' }, update: {}, create: { name: 'MakerBot', slug: 'makerbot' } })
    const stratasys = await prisma.brand.upsert({ where: { slug: 'stratasys' }, update: {}, create: { name: 'Stratasys', slug: 'stratasys' } })
    const zortrax = await prisma.brand.upsert({ where: { slug: 'zortrax' }, update: {}, create: { name: 'Zortrax', slug: 'zortrax' } })

    console.log('✅ Brands ready: Canon, Formlabs, Ultimaker, MakerBot, Stratasys, Zortrax')

    const products: {
        name: string; slug: string; shortDescription: string; description: string
        price: number; comparePrice?: number; stock: number; featured?: boolean
        printTechnology?: string; buildVolume?: string; resolution?: string; connectivity?: string
        specs: Record<string, string>; categoryId: string; brandId: string; sku: string
        images: { url: string; alt: string }[]
    }[] = [

        // ── Canon ──────────────────────────────────────────────────────────────
        {
            name: 'Canon imageFORMULA 3D Pro 100',
            slug: 'canon-imageformula-3d-pro-100',
            shortDescription: 'Canon precision FDM printer with dual-extruder for office professionals',
            description: '<h3>Canon Precision Meets 3D Printing</h3><p>The Canon imageFORMULA 3D Pro 100 brings Canon\'s legendary print precision to FDM additive manufacturing. Designed for office environments, it delivers clean, repeatable results with minimal setup.</p><ul><li>Canon precision motion rails</li><li>Dual-extruder with soluble support material</li><li>Fully enclosed heated chamber</li><li>Canon PRINT 3D software integration</li><li>Auto-calibration with 9-point bed leveling</li></ul>',
            price: 18500,
            comparePrice: 20000,
            stock: 10,
            featured: true,
            printTechnology: 'FDM',
            buildVolume: '300 x 300 x 300mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, USB, LAN',
            specs: { extruders: 'Dual', nozzleTemp: '300°C', bedTemp: '120°C', filamentDiameter: '1.75mm', weight: '22kg', enclosure: 'Heated' },
            categoryId: fdmCat.id, brandId: canon.id, sku: 'CN-IF3D-PRO100',
            images: [{ url: IMG.fdm1, alt: 'Canon imageFORMULA 3D Pro 100' }, { url: IMG.fdm2, alt: 'Canon 3D Pro 100 print quality' }],
        },
        {
            name: 'Canon imageFORMULA Resin Pro R500',
            slug: 'canon-imageformula-resin-pro-r500',
            shortDescription: '10K mono LCD resin printer with Canon colour science for accurate colour output',
            description: '<h3>Canon Colour Science in 3D</h3><p>The imageFORMULA Resin Pro R500 applies Canon\'s decades of colour accuracy expertise to resin 3D printing. A 10K mono LCD paired with Canon SmartExposure delivers sharp, colour-calibrated functional prototypes and visual models.</p><ul><li>10K mono LCD: 9600 x 5400 pixels</li><li>Canon SmartExposure calibration</li><li>Anti-aliasing from Canon imaging engine</li><li>Compatible with all open-source resins</li></ul>',
            price: 6800,
            comparePrice: 7500,
            stock: 15,
            featured: true,
            printTechnology: 'SLA',
            buildVolume: '230 x 130 x 260mm',
            resolution: '0.018mm XY',
            connectivity: 'Wi-Fi, USB',
            specs: { lcdResolution: '9600 x 5400 (10K)', lightSource: '38W UV LED', exposureTime: '1.8s', weight: '11kg' },
            categoryId: resinCat.id, brandId: canon.id, sku: 'CN-IF-RESIN-R500',
            images: [{ url: IMG.resin1, alt: 'Canon imageFORMULA Resin Pro R500' }, { url: IMG.resin2, alt: 'Canon Resin R500 detail output' }],
        },
        {
            name: 'Canon PIXMA 3D Filament Pack — PETG 5-Color',
            slug: 'canon-pixma-3d-filament-petg-5color',
            shortDescription: 'Canon-certified PETG filament in 5 colours, optimised for imageFORMULA printers',
            description: '<p>Canon PIXMA 3D PETG filament is manufactured to Canon\'s strict tolerances for consistent diameter and colour accuracy. Optimised for Canon imageFORMULA printers but compatible with any 1.75mm FDM system.</p>',
            price: 299,
            comparePrice: 349,
            stock: 120,
            specs: { material: 'PETG', diameter: '1.75mm', weight: '1kg x 5', colors: 'Black, White, Red, Blue, Grey', printTemp: '230–250°C' },
            categoryId: filamentCat.id, brandId: canon.id, sku: 'CN-PETG-5COL',
            images: [{ url: IMG.filament, alt: 'Canon PIXMA 3D PETG Filament 5-Color Pack' }],
        },

        // ── Formlabs ────────────────────────────────────────────────────────────
        {
            name: 'Formlabs Form 4',
            slug: 'formlabs-form-4',
            shortDescription: 'Next-generation SLA resin printer with 2× speed of Form 3',
            description: '<h3>The Fastest Desktop SLA Ever</h3><p>The Form 4 redefines desktop stereolithography with a new Light Processing Unit (LPU) that delivers print speeds up to 2× faster than the Form 3. Build professional-quality parts in hours, not days.</p><ul><li>New Low-Force Display (LFD) technology</li><li>Seamless Resin System with auto-fill</li><li>1-click automatic resin cartridge loading</li><li>Open-mode compatible with third-party resins</li><li>Wi-Fi + LAN + USB connectivity</li></ul>',
            price: 5500,
            comparePrice: 6000,
            stock: 18,
            featured: true,
            printTechnology: 'SLA',
            buildVolume: '200 x 125 x 210mm',
            resolution: '0.025mm XY',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { lightSource: 'LFD Laser System', layerThickness: '25–300 µm', weight: '8.2kg', material: 'Formlabs Resins' },
            categoryId: resinCat.id, brandId: formlabs.id, sku: 'FL-FORM4',
            images: [{ url: IMG.resin1, alt: 'Formlabs Form 4 SLA Printer' }, { url: IMG.fdm3, alt: 'Formlabs Form 4 resin output' }],
        },
        {
            name: 'Formlabs Form 4L',
            slug: 'formlabs-form-4l',
            shortDescription: 'Large-format SLA printer for production-scale resin parts',
            description: '<h3>Production-Scale SLA at Your Desk</h3><p>The Form 4L extends the Form 4 platform to a large-format build volume. Print full-scale models, medical devices, and multi-part assemblies in a single run.</p><ul><li>Large 33.5 × 20 × 30 cm build volume</li><li>LFD Technology for uniform exposure</li><li>Compatible with 40+ Formlabs materials</li><li>Automated Resin System (LRS) included</li></ul>',
            price: 11500,
            stock: 8,
            featured: false,
            printTechnology: 'SLA',
            buildVolume: '335 x 200 x 300mm',
            resolution: '0.025mm XY',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { lightSource: 'LFD Laser System', layerThickness: '25–300 µm', weight: '23kg', material: 'Formlabs Resins' },
            categoryId: resinCat.id, brandId: formlabs.id, sku: 'FL-FORM4L',
            images: [{ url: IMG.resin2, alt: 'Formlabs Form 4L Large Format' }, { url: IMG.resin1, alt: 'Formlabs Form 4L build volume' }],
        },
        {
            name: 'Formlabs Tough 2000 Resin 1L',
            slug: 'formlabs-tough-2000-resin-1l',
            shortDescription: 'Engineering-grade resin for stiff, strong, and impact-resistant functional parts',
            description: '<p>Formlabs Tough 2000 Resin produces parts with properties similar to ABS—stiff, strong, and capable of withstanding rough handling. Ideal for prototyping consumer products, tooling, and functional assemblies.</p>',
            price: 380,
            comparePrice: 420,
            stock: 60,
            specs: { material: 'Tough 2000 Resin', volume: '1L', tensileStrength: '46 MPa', elongation: '32%', compatibility: 'Form 3/3L/4/4L' },
            categoryId: filamentCat.id, brandId: formlabs.id, sku: 'FL-TOUGH2000-1L',
            images: [{ url: IMG.filament, alt: 'Formlabs Tough 2000 Resin 1L' }],
        },

        // ── Ultimaker ────────────────────────────────────────────────────────────
        {
            name: 'Ultimaker S7',
            slug: 'ultimaker-s7',
            shortDescription: 'Professional dual-extrusion FDM printer with active leveling and air filtration',
            description: '<h3>The Professional Standard</h3><p>The Ultimaker S7 is engineered for professional environments where reliability is non-negotiable. With its automatic bed leveling, dual extrusion, and built-in air filtration, it handles everything from PLA to fibre-reinforced composites with ease.</p><ul><li>Active bed leveling with capacitive sensor</li><li>Dual AA/BB 0.4mm print cores</li><li>Built-in HEPA + carbon air filtration</li><li>Ultimaker Digital Factory cloud integration</li><li>Flow-based sensor for filament monitoring</li></ul>',
            price: 28500,
            comparePrice: 30000,
            stock: 7,
            featured: true,
            printTechnology: 'FDM',
            buildVolume: '330 x 240 x 300mm',
            resolution: '0.02mm',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { extruders: 'Dual AA/BB 0.4mm', nozzleTemp: '280°C', bedTemp: '140°C', filtration: 'HEPA + Carbon', weight: '20.6kg' },
            categoryId: fdmCat.id, brandId: ultimaker.id, sku: 'UM-S7',
            images: [{ url: IMG.fdm2, alt: 'Ultimaker S7 Professional Printer' }, { url: IMG.fdm4, alt: 'Ultimaker S7 dual extrusion' }],
        },
        {
            name: 'Ultimaker S5 Pro Bundle',
            slug: 'ultimaker-s5-pro-bundle',
            shortDescription: 'S5 printer with Air Manager and Material Station for 24/7 automated production',
            description: '<h3>Uninterrupted 24/7 Printing</h3><p>The Ultimaker S5 Pro Bundle pairs the S5 printer with the Air Manager (filtration) and Material Station (6-spool auto-switching) for fully automated, continuous production without manual intervention.</p><ul><li>6-material automated station</li><li>HEPA + activated carbon filtration</li><li>Humidity-controlled material bays</li><li>Remote monitoring via Ultimaker Digital Factory</li></ul>',
            price: 42000,
            stock: 4,
            featured: false,
            printTechnology: 'FDM',
            buildVolume: '330 x 240 x 300mm',
            resolution: '0.02mm',
            connectivity: 'Wi-Fi, LAN, USB',
            specs: { extruders: 'Dual AA/BB', nozzleTemp: '280°C', bedTemp: '140°C', bundle: 'S5 + Air Manager + Material Station', weight: '23kg' },
            categoryId: fdmCat.id, brandId: ultimaker.id, sku: 'UM-S5-PRO-BUNDLE',
            images: [{ url: IMG.fdm5, alt: 'Ultimaker S5 Pro Bundle' }, { url: IMG.fdm1, alt: 'Ultimaker S5 Material Station' }],
        },
        {
            name: 'Ultimaker PLA Tough 750g — Steel Grey',
            slug: 'ultimaker-pla-tough-750g-grey',
            shortDescription: 'Ultimaker-certified toughened PLA with improved impact resistance',
            description: '<p>Ultimaker Tough PLA offers 10× greater impact resistance over standard PLA, making it suitable for functional prototypes that need to withstand mechanical stress. Certified for the Ultimaker S and S5 Pro series.</p>',
            price: 149,
            comparePrice: 169,
            stock: 90,
            specs: { material: 'Tough PLA', diameter: '2.85mm', weight: '750g', color: 'Steel Grey', printTemp: '210–230°C', bedTemp: '60°C' },
            categoryId: filamentCat.id, brandId: ultimaker.id, sku: 'UM-PLAT-750G-GR',
            images: [{ url: IMG.filament, alt: 'Ultimaker Tough PLA Steel Grey 750g' }],
        },

        // ── MakerBot ─────────────────────────────────────────────────────────────
        {
            name: 'MakerBot METHOD X',
            slug: 'makerbot-method-x',
            shortDescription: 'Industrial FDM printer with heated chamber for ABS, Nylon, and composites',
            description: '<h3>Industrial Performance, Desktop Footprint</h3><p>The MakerBot METHOD X bridges the gap between desktop printers and industrial systems. Its circulating heated build chamber (up to 110°C) virtually eliminates warping in ABS and engineering materials.</p><ul><li>Circulating heated chamber — up to 110°C</li><li>Dual performance extruders</li><li>Stratasys SR-30 soluble support compatible</li><li>Dry-sealed material bays</li><li>CloudPrint remote management</li></ul>',
            price: 16500,
            comparePrice: 18000,
            stock: 9,
            featured: true,
            printTechnology: 'FDM',
            buildVolume: '190 x 190 x 196mm',
            resolution: '0.05mm',
            connectivity: 'Wi-Fi, Ethernet, USB',
            specs: { extruders: 'Dual Performance', chamberTemp: '110°C', nozzleTemp: '315°C', bedTemp: '110°C', materials: 'ABS, Nylon, PC, SR-30', weight: '29.5kg' },
            categoryId: fdmCat.id, brandId: makerbot.id, sku: 'MB-METHOD-X',
            images: [{ url: IMG.fdm3, alt: 'MakerBot METHOD X industrial printer' }, { url: IMG.fdm6, alt: 'MakerBot METHOD X heated chamber' }],
        },
        {
            name: 'MakerBot SKETCH Large',
            slug: 'makerbot-sketch-large',
            shortDescription: 'Safe, classroom-ready large-format FDM printer for education',
            description: '<h3>Safe 3D Printing for the Classroom</h3><p>The MakerBot SKETCH Large is purpose-built for education with a spacious 28L build volume, HEPA air filtration, and fully enclosed design. Manage an entire fleet remotely with MakerBot CloudPrint.</p><ul><li>28L build volume — largest in class</li><li>HEPA + carbon air filtration</li><li>Automatic filament loading</li><li>Fleet management via CloudPrint</li><li>Safe enclosed design for students</li></ul>',
            price: 9800,
            stock: 14,
            featured: false,
            printTechnology: 'FDM',
            buildVolume: '350 x 280 x 285mm',
            resolution: '0.1mm',
            connectivity: 'Wi-Fi, Ethernet, USB',
            specs: { extruders: 'Single Smart Extruder+', nozzleTemp: '250°C', bedTemp: '110°C', filtration: 'HEPA + Carbon', weight: '27kg', target: 'Education' },
            categoryId: fdmCat.id, brandId: makerbot.id, sku: 'MB-SKETCH-LG',
            images: [{ url: IMG.fdm4, alt: 'MakerBot SKETCH Large for education' }, { url: IMG.fdm2, alt: 'MakerBot SKETCH Large classroom use' }],
        },

        // ── Stratasys ────────────────────────────────────────────────────────────
        {
            name: 'Stratasys F170',
            slug: 'stratasys-f170',
            shortDescription: 'Entry-level industrial FDM from the inventors of FDM technology',
            description: '<h3>Industrial FDM from the Pioneers</h3><p>Stratasys invented FDM. The F170 brings that industrial DNA to a compact format. With a wide material set—including ABS, ASA, PLA, and TPU—and a locked-down reliable platform, it\'s the first choice for engineering teams.</p><ul><li>GrabCAD Print software included</li><li>Soluble QSR support material</li><li>Touchscreen + Wi-Fi control</li><li>Stratasys Certified service network</li></ul>',
            price: 35000,
            comparePrice: 38000,
            stock: 5,
            featured: true,
            printTechnology: 'FDM',
            buildVolume: '254 x 254 x 254mm',
            resolution: '0.127mm',
            connectivity: 'Wi-Fi, Ethernet',
            specs: { extruders: 'Dual (Model + Support)', nozzleTemp: '295°C', materials: 'ABS, ASA, PLA, TPU, QSR Support', weight: '148kg' },
            categoryId: fdmCat.id, brandId: stratasys.id, sku: 'STR-F170',
            images: [{ url: IMG.fdm1, alt: 'Stratasys F170 industrial FDM printer' }, { url: IMG.fdm5, alt: 'Stratasys F170 build quality' }],
        },
        {
            name: 'Stratasys J55 Prime',
            slug: 'stratasys-j55-prime',
            shortDescription: 'Full-colour PolyJet printer for vivid multi-material prototypes',
            description: '<h3>Full-Colour Multi-Material PolyJet Printing</h3><p>The Stratasys J55 Prime is an office-friendly PolyJet system that prints full-colour, multi-material models in a single run. With 500,000+ colour combinations and Shore A 27–95 flexibility range, it is the definitive colour prototyping tool.</p><ul><li>500,000+ colour combinations</li><li>6 simultaneously jetting materials</li><li>Rotating build platform for consistent quality</li><li>GrabCAD Print workflow</li></ul>',
            price: 78000,
            stock: 3,
            featured: false,
            printTechnology: 'FDM',
            buildVolume: '350 x 350 x 200mm',
            resolution: '0.014mm',
            connectivity: 'LAN',
            specs: { technology: 'PolyJet', materials: '6 simultaneous', colourRange: '500,000+', shoreA: '27–95', weight: '172kg' },
            categoryId: fdmCat.id, brandId: stratasys.id, sku: 'STR-J55P',
            images: [{ url: IMG.fdm6, alt: 'Stratasys J55 Prime PolyJet printer' }, { url: IMG.fdm3, alt: 'Stratasys J55 Prime colour output' }],
        },

        // ── Zortrax ──────────────────────────────────────────────────────────────
        {
            name: 'Zortrax M300 Dual',
            slug: 'zortrax-m300-dual',
            shortDescription: 'Large-format dual-extruder FDM with auto-calibration for Z-SUITE workflow',
            description: '<h3>Reliable Large-Format Dual Extrusion</h3><p>The Zortrax M300 Dual offers a 300×300×300mm build volume with dual extruder support for soluble HIPS/PVA supports. Its Z-SUITE slicer provides a streamlined, optimised workflow for consistent results every time.</p><ul><li>300 × 300 × 300mm build volume</li><li>Dual extruder — model + soluble support</li><li>Auto bed leveling</li><li>Z-SUITE slicer included</li><li>Compatible with Z-ABS, Z-PLA, Z-PETG, Z-HIPS</li></ul>',
            price: 12500,
            comparePrice: 13800,
            stock: 11,
            featured: false,
            printTechnology: 'FDM',
            buildVolume: '300 x 300 x 300mm',
            resolution: '0.09mm',
            connectivity: 'Wi-Fi, USB, Ethernet',
            specs: { extruders: 'Dual', nozzleTemp: '290°C', bedTemp: '105°C', materials: 'Z-ABS, Z-PLA, Z-PETG, Z-HIPS', weight: '20kg' },
            categoryId: fdmCat.id, brandId: zortrax.id, sku: 'ZO-M300-DUAL',
            images: [{ url: IMG.fdm2, alt: 'Zortrax M300 Dual large format' }, { url: IMG.fdm4, alt: 'Zortrax M300 Dual precision output' }],
        },
        {
            name: 'Zortrax Inkspire 2',
            slug: 'zortrax-inkspire-2',
            shortDescription: '8K mono resin printer with UV calibration for dental and jewellery',
            description: '<h3>Precision Resin for Dental & Jewellery</h3><p>The Zortrax Inkspire 2 is a professional mono LCD resin printer delivering 8K resolution for dental models, jewellery casting masters, and miniatures. Built-in UV calibration ensures uniform exposure across every layer.</p><ul><li>8K mono LCD</li><li>Built-in UV calibration tool</li><li>Zortrax HELIODENT resin support</li><li>Tilt mechanism for smooth layer separation</li></ul>',
            price: 4800,
            comparePrice: 5400,
            stock: 16,
            featured: true,
            printTechnology: 'SLA',
            buildVolume: '197 x 124 x 280mm',
            resolution: '0.024mm XY',
            connectivity: 'Wi-Fi, USB',
            specs: { lcdResolution: '7680 x 4320 (8K)', lightSource: '36W UV LED', exposureTime: '1.5s', weight: '10.8kg' },
            categoryId: resinCat.id, brandId: zortrax.id, sku: 'ZO-INKSPIRE2',
            images: [{ url: IMG.resin2, alt: 'Zortrax Inkspire 2 resin printer' }, { url: IMG.resin1, alt: 'Zortrax Inkspire 2 precision output' }],
        },

        // ── Extra accessories ─────────────────────────────────────────────────────
        {
            name: 'Dual-Zone Filament Dryer Box',
            slug: 'dual-zone-filament-dryer-box',
            shortDescription: 'Active dual-spool filament dryer with PTC heating up to 70°C',
            description: '<p>Keep your filament moisture-free with this dual-zone active dryer. Supports two 1kg spools simultaneously, with independent temperature zones (40–70°C), a built-in hygrometer, and a 24-hour timer. Compatible with PLA, PETG, Nylon, ABS, and TPU.</p>',
            price: 189,
            comparePrice: 229,
            stock: 75,
            specs: { capacity: '2 × 1kg spools', tempRange: '40–70°C', heating: 'PTC', timer: '0–24h', hygrometer: 'Built-in' },
            categoryId: accCat.id, brandId: formlabs.id, sku: 'ACC-DRYER-DUAL',
            images: [{ url: IMG.acc, alt: 'Dual-Zone Filament Dryer Box' }],
        },
        {
            name: 'Brass Nozzle Cleaning Kit',
            slug: 'brass-nozzle-cleaning-kit',
            shortDescription: '20-piece nozzle cleaning needle set with cold-pull rope and lubricant',
            description: '<p>A complete nozzle maintenance kit including 20 stainless-steel cleaning needles (0.2–0.5mm), a PTFE cold-pull rope, nozzle lubricant pen, and a heat-resistant cleaning brush. Compatible with all 3D printer brands.</p>',
            price: 45,
            comparePrice: 59,
            stock: 200,
            specs: { needles: '20 pcs (0.2–0.5mm)', includes: 'Needles + Cold-Pull Rope + Lube + Brush', compatibility: 'Universal' },
            categoryId: accCat.id, sku: 'ACC-NOZZLE-CLEAN', brandId: canon.id,
            images: [{ url: IMG.acc, alt: 'Brass Nozzle Cleaning Kit' }],
        },
    ]

    for (const p of products) {
        const { images, specs, ...rest } = p
        const data = { ...rest, specs: JSON.stringify(specs) } as any

        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: data,
            create: data,
        })

        const existing = await prisma.productImage.findMany({ where: { productId: product.id } })
        if (existing.length === 0) {
            await prisma.productImage.createMany({
                data: images.map((img, idx) => ({ url: img.url, alt: img.alt, position: idx, productId: product.id })),
            })
        }

        console.log(`  ✅ ${p.name}`)
    }

    console.log('\n🎉 Done! Added products for: Canon, Formlabs, Ultimaker, MakerBot, Stratasys, Zortrax')
}

main().catch(console.error).finally(() => prisma.$disconnect())
