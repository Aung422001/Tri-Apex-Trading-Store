# Frontend Architecture Guide
## Triapex Trading Group — Next.js 14 + TypeScript

---

## 🤖 Master AI Prompt for Frontend

Paste this into VS Code Copilot Chat / Gemini Code Assist before asking frontend questions:

```
You are a frontend engineer building the Triapex Trading Group 3D printer store.
Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query.
Brand: Company name "Triapex Trading Group", colors — primary: #1E3A5F (navy blue), 
accent: #F97316 (orange), background: white/gray-50.
Always:
- Use TypeScript with proper interfaces (no 'any')
- Use Next.js App Router conventions (Server Components by default, 'use client' when needed)
- Style with Tailwind utility classes + shadcn/ui components
- Fetch server data in Server Components, mutations via React Query in Client Components
- Add loading.tsx skeletons and error.tsx boundaries to all route segments
- Make all UI fully responsive (mobile-first)
```

---

## 📁 Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, providers)
│   ├── page.tsx                      # Homepage
│   ├── loading.tsx                   # Root loading UI
│   ├── error.tsx                     # Root error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── robots.ts                     # robots.txt
│   │
│   ├── (shop)/                       # Public store group
│   │   ├── products/
│   │   │   ├── page.tsx              # Product catalog
│   │   │   ├── loading.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Product detail
│   │   │       └── loading.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx              # Order history
│   │   │   └── [id]/page.tsx         # Order detail/tracking
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── (auth)/                       # Auth pages group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── dashboard/                    # User dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── admin/                        # Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Admin overview
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── customers/page.tsx
│   │   └── blog/page.tsx
│   │
│   └── api/                          # Next.js API routes
│       ├── auth/[...nextauth]/route.ts
│       └── revalidate/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Main navigation
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx            # Slide-out cart
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── PromoBanner.tsx
│   │   └── Testimonials.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── ProductSpecTable.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── QuantityStepper.tsx
│   │   └── ReviewSection.tsx
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── ShippingOptions.tsx
│   │   ├── OrderSummary.tsx
│   │   └── PaymentForm.tsx           # Stripe Elements
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── OrdersTable.tsx
│   │   └── ProductForm.tsx
│   ├── ui/                           # shadcn/ui components
│   └── shared/
│       ├── LoadingSkeleton.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       ├── StarRating.tsx
│       ├── PriceDisplay.tsx
│       └── AIChatWidget.tsx
│
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useAuth.ts
│   └── useWishlist.ts
│
├── store/                            # Zustand stores
│   ├── cartStore.ts
│   ├── wishlistStore.ts
│   └── uiStore.ts
│
├── lib/
│   ├── api.ts                        # Axios instance
│   ├── auth.ts                       # NextAuth config
│   ├── stripe.ts                     # Stripe client
│   └── utils.ts                      # cn(), formatPrice()
│
└── types/
    ├── product.ts
    ├── order.ts
    ├── user.ts
    └── api.ts
```

---

## 🎨 Design System

### Brand Colors (Tailwind Config)
```javascript
// AI Prompt:
// Extend tailwind.config.ts with Triapex brand colors:
// - primary: #1E3A5F (navy blue) — used for headers, buttons, CTAs
// - accent: #F97316 (orange) — used for highlights, badges, hover states  
// - success: #22C55E, warning: #EAB308, danger: #EF4444
// Add custom animation: 'shimmer' for skeleton loading effects
```

### Component Prompt Templates

**ProductCard:**
```
Create a ProductCard React component (TypeScript) for Triapex 3D printer store:
Props: { product: Product } where Product has id, name, slug, price, 
comparePrice, images[0], rating, reviewCount, brand, inStock
UI: Card with hover shadow, product image (next/image), brand badge, 
product name (line-clamp-2), star rating, price with sale price crossed out, 
"Add to Cart" button (disabled if !inStock), wishlist heart icon.
Use Tailwind + shadcn/ui Card. Link to /products/[slug].
```

**HeroBanner:**
```
Create a full-width HeroBanner for Triapex Trading Group homepage:
- Split layout: left side has headline "Precision 3D Printing Solutions", 
  subheadline, two CTA buttons ("Shop Now" orange, "View Catalog" outline)
- Right side: 3D printer hero image with floating stat badges
- Background: gradient from navy #1E3A5F to #0F2440
- Text: white, fully responsive (stacks on mobile)
- Add subtle entrance animation using Tailwind animate classes
```

---

## 🗃️ State Management (Zustand)

```typescript
// AI Prompt:
// Create a Zustand cart store (TypeScript) for Triapex store:
// State: items (CartItem[]), isOpen (boolean)
// Actions: addItem, removeItem, updateQuantity, clearCart, toggleDrawer
// CartItem: { productId, variantId, name, price, image, quantity, stock }
// Persist cart to localStorage. Calculate: totalItems, subtotal, savings.
// Handle edge cases: max quantity = stock, prevent duplicates (merge instead)
```

---

## 🔄 Data Fetching Patterns

```typescript
// Server Component (product list page)
// AI Prompt:
// Write a Next.js 14 Server Component for /products page that:
// 1. Reads searchParams (category, brand, minPrice, maxPrice, sort, page)
// 2. Fetches products from backend API with those filters
// 3. Returns ProductGrid + ProductFilters (client component) + Pagination
// Add generateMetadata() with dynamic title based on filters.
// Implement ISR with revalidate: 300

// Client Component (add to cart)
// AI Prompt:
// Write a React Query useMutation hook for adding items to cart:
// - POST /api/cart with { productId, variantId, quantity }
// - On success: update Zustand cart store + show toast
// - On error: show error toast with message
// - Handle loading state on the button
```

---

## 🖼️ Key Page Prompts

### Homepage
```
Build the Triapex Trading Group homepage (Next.js Server Component):
Sections in order:
1. HeroBanner — "Leading 3D Printer Solutions in Malaysia"
2. TrustBadges — Free shipping, Warranty, Expert support, Secure payment
3. FeaturedCategories — FDM Printers, Resin Printers, Filaments, Accessories (grid of 4)
4. FeaturedProducts — 8 products from API marked as featured
5. PromoBanner — Full-width orange CTA "Industrial Grade Printers Now Available"
6. WhyChooseUs — 3 columns: Quality Products, Expert Support, Fast Delivery
7. Testimonials — Customer reviews carousel
8. RecentBlog — Latest 3 blog posts
9. NewsletterSignup — Email subscription with gradient background
```

### Product Detail Page
```
Build the product detail page for /products/[slug] (Next.js + TypeScript):
- Left: ImageGallery (main image + thumbnail row, zoom on hover)
- Right: Brand badge, product name (h1), rating + review count link,
  Price (large, with strikethrough compare price), 
  Variant selector (if variants exist), 
  Stock indicator (In Stock / Low Stock / Out of Stock),
  Quantity stepper + "Add to Cart" button (orange, full width),
  "Add to Wishlist" secondary button,
  Product highlights (bullet points with checkmark icons),
  Shipping info accordion
- Below fold: Tabs (Description, Specifications, Reviews, FAQ)
- Related Products section (4 cards)
Add generateMetadata() for SEO. Add Product JSON-LD structured data.
```

---

## 📱 Responsive Breakpoints

```
Mobile: < 768px — single column, bottom cart drawer, hamburger menu
Tablet: 768px–1024px — 2 column product grid, collapsible filters
Desktop: > 1024px — 3–4 column product grid, sidebar filters, full nav
```

---

## ⚡ Performance Checklist

```
// AI Prompt:
// Review this Next.js page and optimize for performance:
// - Replace all <img> with next/image with proper sizes attribute
// - Add Suspense boundaries around client components with skeleton fallback
// - Move static data fetching to generateStaticParams for ISR
// - Lazy load below-fold sections with dynamic imports
// - Add prefetch to all major navigation links
```
