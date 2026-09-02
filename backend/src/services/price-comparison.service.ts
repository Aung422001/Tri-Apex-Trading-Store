import { chromium, Browser } from 'playwright'
import { AppError } from '../utils/apiResponse'

interface CompetitorPrice {
    site: string
    url: string
    price: string | null
    currency: string
    available: boolean
    note?: string
}

interface PriceComparisonResult {
    productName: string
    ourPrice: number
    ourCurrency: string
    competitors: CompetitorPrice[]
    aiSummary: string
    bestDeal: string
}

// Singleton browser instance — reuse across requests to save startup time.
// Cache the in-flight promise, not just the resolved browser: comparePrice
// scrapes both sites via Promise.all, so two callers hit this before the first
// launch resolves and would otherwise each start a Chromium, leaking one.
let browserPromise: Promise<Browser> | null = null

async function getBrowser(): Promise<Browser> {
    if (browserPromise) {
        const existing = await browserPromise.catch(() => null)
        if (existing?.isConnected()) return existing
    }

    browserPromise = chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
        ],
    })

    try {
        return await browserPromise
    } catch (err) {
        browserPromise = null // don't cache a failed launch
        throw err
    }
}

/** Release the shared browser — call on server shutdown. */
export async function closeBrowser(): Promise<void> {
    const pending = browserPromise
    browserPromise = null
    if (!pending) return
    const browser = await pending.catch(() => null)
    await browser?.close().catch(() => undefined)
}

async function scrapeWithPlaywright(
    site: string,
    url: string,
    currency: string,
    priceSelector: string,
    titleSelector: string,
    productName: string
): Promise<CompetitorPrice> {
    const browser = await getBrowser()
    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 },
        locale: 'en-US',
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
        },
    })
    const page = await context.newPage()

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })

        // Wait a moment for JS-rendered content
        await page.waitForTimeout(3000)

        // Try to get price text
        const priceText = await page.locator(priceSelector).first().textContent({ timeout: 5000 }).catch(() => null)
        const titleText = await page.locator(titleSelector).first().textContent({ timeout: 3000 }).catch(() => null)

        if (!priceText) {
            return {
                site,
                url,
                price: null,
                currency,
                available: false,
                note: 'No price found — site may require login or uses heavy bot protection',
            }
        }

        // Check if result is relevant to our product
        const productWords = productName.toLowerCase().split(' ').filter((w) => w.length > 2)
        const titleLower = (titleText || '').toLowerCase()
        const isRelevant = productWords.some((w) => titleLower.includes(w))

        return {
            site,
            // The search-results URL. The previous `page.locator('a').first()`
            // returned the page's first anchor — a nav/logo link, not the product.
            url,
            price: priceText.trim(),
            currency,
            available: true,
            note: isRelevant ? undefined : `Result may not match exactly: "${(titleText || '').substring(0, 60)}"`,
        }
    } catch (err: any) {
        const reason = err.name === 'TimeoutError' ? 'Page timed out (20s)' : err.message?.split('\n')[0] || 'Unknown error'
        return { site, url, price: null, currency, available: false, note: reason }
    } finally {
        await context.close()
    }
}

async function scrapeLazada(productName: string): Promise<CompetitorPrice> {
    const url = `https://www.lazada.com.mm/catalog/?q=${encodeURIComponent(productName)}&from=input`
    return scrapeWithPlaywright(
        'Lazada',
        url,
        'MMK',
        // Lazada price selectors (try multiple in order)
        '[data-qa-locator="product-item"] .price--NVB62 span, .aBrP0 span, [class*="price"] span',
        '[data-qa-locator="product-item"] .title--wFj93, [class*="product-card"] [class*="title"]',
        productName
    )
}

async function scrapeShopee(productName: string): Promise<CompetitorPrice> {
    const url = `https://shopee.com.mm/search?keyword=${encodeURIComponent(productName)}`
    return scrapeWithPlaywright(
        'Shopee',
        url,
        'MMK',
        // Shopee price selectors
        '.shopee-search-item-result__item .zO1DMD, [class*="price"], ._1xk7ak',
        '.shopee-search-item-result__item .Cve6sh, [class*="name"]',
        productName
    )
}

function generateSummary(
    productName: string,
    ourPrice: number,
    competitors: CompetitorPrice[]
): { summary: string; bestDeal: string } {
    const available = competitors.filter((c) => c.available && c.price)
    const unavailable = competitors.filter((c) => !c.available)

    if (available.length === 0) {
        return {
            summary: `We searched ${competitors.length} competitor site(s) for "${productName}" but could not retrieve live pricing (sites may require JavaScript rendering or have bot protection). Our price is MMK ${ourPrice.toLocaleString()}.`,
            bestDeal: 'Triapex Trading Group',
        }
    }

    const parts: string[] = []
    parts.push(`Price comparison for ${productName}: Triapex price is MMK ${ourPrice.toLocaleString()}.`)
    for (const c of available) parts.push(`${c.site}: ${c.price}.`)
    if (unavailable.length > 0) {
        parts.push(`${unavailable.map((c) => c.site).join(', ')} could not be reached.`)
    }

    return {
        summary: parts.join(' '),
        bestDeal: 'Triapex Trading Group (verified local retailer with 1-year warranty)',
    }
}

export class PriceComparisonService {
    async comparePrice(productName: string, ourPrice: number, currency = 'MMK'): Promise<PriceComparisonResult> {
        if (!productName) throw new AppError(400, 'Product name is required')

        // Scrape both sites in parallel using real headless browser
        const [lazadaResult, shopeeResult] = await Promise.all([
            scrapeLazada(productName),
            scrapeShopee(productName),
        ])

        const competitors = [lazadaResult, shopeeResult]
        const { summary, bestDeal } = generateSummary(productName, ourPrice, competitors)

        return {
            productName,
            ourPrice,
            ourCurrency: currency,
            competitors,
            aiSummary: summary,
            bestDeal,
        }
    }
}

export const priceComparisonService = new PriceComparisonService()
