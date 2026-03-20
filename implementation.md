# Implementation Guide
## Triapex Trading Group — 3D Printer Store

---

## 🧠 AI Prompt for VS Code (Copilot / Cursor / Gemini Code Assist)

Use the following master prompt to bootstrap any feature:

```
You are a senior full-stack developer working on "Triapex Trading Group" — a professional 
e-commerce platform for 3D printers built with Next.js 14 (App Router), TypeScript, 
Tailwind CSS, shadcn/ui on the frontend; and Node.js, Express.js, Prisma, PostgreSQL 
on the backend. Always write clean, typed, production-ready code. Follow REST conventions, 
use proper error handling, and add JSDoc comments to all exports.
```

---

## Phase 1 — Project Initialization

### Step 1: Initialize Monorepo
```bash
mkdir triapex-3d-store && cd triapex-3d-store
pnpm init
pnpm add -w concurrently dotenv-cli
```

### Step 2: Create Frontend (Next.js)
```bash
pnpm create next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### Step 3: Create Backend (Express)
```bash
mkdir backend && cd backend
pnpm init
pnpm add express cors helmet morgan cookie-parser bcryptjs jsonwebtoken \
         @prisma/client zod nodemailer stripe @google/generative-ai ioredis
pnpm add -D typescript ts-node-dev @types/express @types/node @types/cors \
         @types/morgan @types/bcryptjs @types/jsonwebtoken prisma
npx tsc --init
npx prisma init
```

### Step 4: Install shadcn/ui in Frontend
```bash
cd frontend
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card input label badge \
     dialog sheet dropdown-menu table form toast
```

---

## Phase 2 — Database Schema (Prisma)

**AI Prompt:**
```
Generate a complete Prisma schema for a 3D printer e-commerce store with these models: 
User, Product, Category, ProductImage, ProductVariant, Cart, CartItem, Order, OrderItem, 
Address, Review, Coupon, BlogPost. Include proper relations, indexes, and enums for 
OrderStatus (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED) and UserRole (USER, ADMIN).
```

### Key Models Overview:
- **User** → has Cart, Orders, Addresses, Reviews, Wishlist
- **Product** → has Category, Images, Variants, Reviews
- **Order** → has OrderItems, Address, payment details
- **Coupon** → discount codes with expiry and usage limits

---

## Phase 3 — Authentication System

**AI Prompt:**
```
Create a complete JWT authentication system for an Express.js TypeScript backend with:
- POST /api/auth/register — hash password with bcrypt, return JWT + refresh token
- POST /api/auth/login — validate credentials, set httpOnly cookie with refresh token
- POST /api/auth/refresh — validate refresh token, return new JWT
- POST /api/auth/logout — clear cookie
- GET /api/auth/me — return current user (protected route)
- Google OAuth callback handler
Include middleware: authenticate (verify JWT), authorize (check role)
```

**Frontend Auth (NextAuth.js):**
```
Set up NextAuth.js v5 with credentials provider and Google OAuth for a Next.js 14 
App Router project. Include session management, protected route middleware, and 
login/register pages with react-hook-form + zod validation and shadcn/ui components.
```

---

## Phase 4 — Product Catalog

**AI Prompt:**
```
Build a product catalog API (Express + Prisma) and UI (Next.js) for a 3D printer store:

Backend:
- GET /api/products — paginated list with filters (category, price range, brand, 
  print technology) and search. Return total count for pagination.
- GET /api/products/:slug — full product detail with images, variants, avg rating
- POST/PUT/DELETE /api/products — admin only, validate with Zod

Frontend:
- /products page with sidebar filters (Checkbox groups), price range slider, 
  sort dropdown, product grid (ProductCard component with image, name, price, rating)
- /products/[slug] page with image gallery (swiper), spec table, add-to-cart button, 
  reviews section, related products
Use Tailwind CSS + shadcn/ui components throughout.
```

---

## Phase 5 — Cart & Checkout

**AI Prompt:**
```
Implement cart and checkout for the Triapex 3D printer store:

Backend:
- GET/POST/PUT/DELETE /api/cart — manage cart items (authenticated users)
- POST /api/orders — create order, validate stock, apply coupon, calculate total
- POST /api/payments/stripe — create Stripe payment intent
- POST /api/payments/webhook — handle Stripe events (payment_intent.succeeded)

Frontend:
- Cart drawer (Sheet component) with item list, quantity stepper, subtotal
- Checkout page: Address form, shipping method selection, order summary, Stripe Elements
- Order confirmation page with order number and summary
All forms use react-hook-form + zod. State managed with Zustand.
```

---

## Phase 6 — Admin Dashboard

**AI Prompt:**
```
Build an admin dashboard for Triapex 3D printer store using Next.js 14 App Router 
at /admin/* (protected, ADMIN role only):
- /admin — overview cards (total sales, orders today, customers, low stock alerts) 
  + recent orders table + revenue chart (recharts)
- /admin/products — data table with search, filters, bulk actions, edit/delete
- /admin/products/new — product creation form with image upload (Cloudinary), 
  variants, rich text description
- /admin/orders — order management table, status update dropdown, export CSV
- /admin/customers — customer list with order count and total spend
Use shadcn/ui DataTable, Charts, and Dialog components.
```

---

## Phase 7 — AI Features (Gemini)

See `gemini.md` for full implementation details.

---

## Phase 8 — SEO & Performance

**AI Prompt:**
```
Optimize the Next.js 14 Triapex 3D printer store for SEO and performance:
- Add generateMetadata() to all pages (dynamic title, description, OG tags)
- Add JSON-LD structured data (Product schema) to product pages
- Create sitemap.xml and robots.txt routes
- Implement ISR (revalidate: 3600) for product pages
- Add next/image optimization throughout
- Implement Redis caching for product list API responses
- Add loading.tsx and error.tsx to all route segments
```

---

## Phase 9 — Testing

**AI Prompt:**
```
Write tests for the Triapex backend using Jest and Supertest:
- Unit tests for auth service (register, login, token refresh)
- Integration tests for product API (CRUD, filtering, pagination)
- Integration tests for order flow (create order, payment, status update)
Mock Prisma client and Redis. Aim for 80%+ coverage.
```

---

## Phase 10 — Deployment

### Frontend (Vercel)
```bash
vercel --prod
# Set env vars in Vercel dashboard
```

### Backend (Railway)
```bash
railway up
# Configure PostgreSQL and Redis add-ons
# Set all .env variables
```

---

## 🔧 VS Code Extensions to Install

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "github.copilot",
    "google.geminicodeassist",
    "humao.rest-client",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens"
  ]
}
```

---

## 📋 Git Commit Convention

Follow Conventional Commits:
```
feat: add product filter by print technology
fix: resolve cart quantity update bug
chore: update dependencies
docs: add API documentation
refactor: extract payment service
test: add order creation tests
```
