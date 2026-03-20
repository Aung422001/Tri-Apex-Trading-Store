# Backend Architecture Guide
## Triapex Trading Group — Express.js + TypeScript API

---

## 🤖 Master AI Prompt for Backend

Paste this into VS Code Copilot Chat / Gemini Code Assist before asking backend questions:

```
You are a backend engineer building the Triapex Trading Group 3D printer e-commerce API.
Stack: Node.js 18, Express.js, TypeScript, Prisma ORM, PostgreSQL, Redis, JWT auth.
Always:
- Use async/await with proper try/catch or a global error handler
- Validate all inputs with Zod before processing
- Return consistent JSON: { success: true, data: {} } or { success: false, error: "msg" }
- Use HTTP status codes correctly (200, 201, 400, 401, 403, 404, 422, 500)
- Add JSDoc to all exported functions
- Use Prisma transactions for multi-step DB operations
- Cache read-heavy endpoints with Redis (TTL 5 min)
```

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── index.ts                  # Server entry point
│   ├── app.ts                    # Express app setup
│   ├── config/
│   │   ├── env.ts                # Validated env variables (Zod)
│   │   ├── database.ts           # Prisma client singleton
│   │   └── redis.ts              # Redis client
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── user.routes.ts
│   │   ├── review.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── blog.routes.ts
│   │   └── ai.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── ai.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── email.service.ts
│   │   ├── storage.service.ts
│   │   └── ai.service.ts
│   ├── middleware/
│   │   ├── authenticate.ts       # Verify JWT
│   │   ├── authorize.ts          # Role-based access
│   │   ├── validate.ts           # Zod schema validation
│   │   ├── rateLimiter.ts        # express-rate-limit
│   │   ├── errorHandler.ts       # Global error handler
│   │   └── upload.ts             # Multer file upload
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── schemas/                  # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   └── order.schema.ts
│   └── utils/
│       ├── jwt.ts
│       ├── hash.ts
│       ├── pagination.ts
│       └── apiResponse.ts
├── tests/
│   ├── auth.test.ts
│   ├── product.test.ts
│   └── order.test.ts
├── .env
├── tsconfig.json
└── package.json
```

---

## 🔌 API Endpoints Reference

### Auth `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | None | Create account |
| POST | `/login` | None | Login, set cookie |
| POST | `/logout` | Cookie | Clear refresh token |
| POST | `/refresh` | Cookie | New access token |
| GET | `/me` | JWT | Get current user |
| POST | `/google` | None | Google OAuth callback |
| POST | `/forgot-password` | None | Send reset email |
| POST | `/reset-password` | None | Reset with token |

### Products `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | List with filters & pagination |
| GET | `/:slug` | None | Product detail |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |
| POST | `/:id/images` | Admin | Upload images |

### Orders `/api/orders`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | User | Create order |
| GET | `/` | User | List user orders |
| GET | `/:id` | User | Order detail |
| PUT | `/:id/cancel` | User | Cancel order |
| GET | `/admin/all` | Admin | All orders |
| PUT | `/admin/:id/status` | Admin | Update status |

### AI `/api/ai`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/recommend` | None | Product recommendations |
| POST | `/chat` | None | Support chatbot |
| POST | `/compare` | None | Compare products |

---

## 🗄️ Prisma Schema (Key Parts)

**AI Prompt to generate full schema:**
```
Generate a complete Prisma schema for Triapex 3D printer store with PostgreSQL.
Include: User, Product, Category, Brand, ProductImage, ProductVariant, 
Cart, CartItem, Order, OrderItem, ShippingAddress, Review, Wishlist, 
Coupon, BlogPost, BlogTag models.
Add appropriate indexes for search performance and cascade delete rules.
```

---

## 🔐 Auth Implementation Pattern

```typescript
// AI Prompt:
// Implement JWT auth middleware for Express TypeScript that:
// 1. Reads Bearer token from Authorization header
// 2. Verifies with jsonwebtoken using env secret
// 3. Attaches decoded user to req.user
// 4. Throws 401 if missing/invalid, 403 if expired

// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token expired or invalid' })
  }
}
```

---

## 📦 Redis Caching Pattern

```typescript
// AI Prompt:
// Create a cache middleware for Express that:
// 1. Checks Redis for cached response using req.url as key
// 2. Returns cached data if found
// 3. Otherwise calls next(), intercepts res.json(), caches result
// TTL: 300 seconds for product lists, 3600 for static data

// Usage: router.get('/products', cache(300), productController.list)
```

---

## 💳 Stripe Payment Flow

```typescript
// AI Prompt:
// Implement Stripe payment for an Express backend:
// 1. POST /api/payments/intent — create PaymentIntent with order amount
// 2. POST /api/payments/webhook — handle payment_intent.succeeded event,
//    update order status to PROCESSING, send confirmation email
// Use stripe.webhooks.constructEvent() to verify webhook signature
```

---

## 📧 Email Service

```typescript
// AI Prompt:
// Create an email service using Nodemailer + SendGrid SMTP for:
// - Order confirmation email (with order summary table)
// - Shipping notification (with tracking link)
// - Password reset email (with secure token link)
// - Welcome email for new registrations
// Use HTML templates with Triapex branding (dark blue + orange colors)
```

---

## 🚦 Error Handling

```typescript
// Global error handler — add to app.ts last
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message)
  }
}

// AI Prompt:
// Create an Express global error handler middleware that:
// - Handles AppError instances with their status codes
// - Handles Prisma errors (P2002 = duplicate, P2025 = not found)  
// - Handles Zod validation errors — return 422 with field-level errors
// - Handles JWT errors — return 401
// - Returns 500 for all unexpected errors
// Never expose stack traces in production
```
