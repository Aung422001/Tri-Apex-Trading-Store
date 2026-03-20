# Product Requirements Document (PRD)
## Triapex Trading Group — 3D Printer E-Commerce Platform

---

## 1. Executive Summary

**Company:** Triapex Trading Group  
**Product:** Full-stack e-commerce website for selling 3D printers, filaments, accessories, and spare parts.  
**Goal:** Build a professional, scalable, and high-converting online store that serves individual makers, small businesses, and industrial clients.

---

## 2. Objectives

- Establish a strong digital presence for Triapex Trading Group.
- Enable customers to browse, compare, and purchase 3D printers and related products.
- Provide an admin dashboard to manage products, orders, and customers.
- Integrate secure payment gateways and real-time order tracking.
- Deliver a mobile-first, SEO-optimized, fast-loading website.

---

## 3. Target Users

| Persona | Description |
|---|---|
| Individual Makers | Hobbyists buying entry-level printers and filament |
| SME Buyers | Small businesses needing mid-range printers |
| Industrial Clients | Companies purchasing industrial-grade 3D printers |
| Admin Users | Triapex staff managing the backend |

---

## 4. Core Features

### 4.1 Public-Facing (Frontend)
- **Homepage** — Hero banner, featured products, categories, promotions, testimonials
- **Product Catalog** — Filter by brand, price, print technology (FDM/SLA/SLS), build volume
- **Product Detail Page** — Image gallery, specs table, reviews, related products, Add to Cart
- **Shopping Cart** — Item list, quantity update, remove, subtotal
- **Checkout** — Address form, shipping options, payment gateway integration
- **User Authentication** — Register, login, forgot password, OAuth (Google)
- **User Dashboard** — Order history, saved addresses, wishlist
- **Order Tracking** — Real-time status updates
- **Blog/Resources** — Printing guides, product comparisons, tips
- **Contact/Support** — Contact form, live chat widget, FAQ

### 4.2 Admin Dashboard (Backend)
- **Product Management** — CRUD products, variants, images, stock levels
- **Order Management** — View, update status, export orders
- **Customer Management** — View accounts, order history
- **Analytics** — Sales charts, top products, revenue overview
- **Promotions** — Create discount codes, flash sales
- **CMS** — Manage blog posts, banners, FAQs

---

## 5. Non-Functional Requirements

- **Performance:** Page load < 2 seconds (LCP), 90+ Lighthouse score
- **Security:** HTTPS, JWT auth, input validation, rate limiting, OWASP top 10 compliance
- **Scalability:** Microservice-ready architecture, horizontal scaling support
- **Accessibility:** WCAG 2.1 AA compliant
- **SEO:** SSR/SSG pages, structured data (JSON-LD), sitemap.xml, robots.txt
- **Mobile:** Fully responsive, PWA support

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL (primary), Redis (cache/sessions) |
| ORM | Prisma |
| Auth | JWT + Refresh Tokens, NextAuth.js |
| File Storage | Cloudinary / AWS S3 |
| Payments | Stripe + PayPal |
| AI Assistant | Google Gemini API |
| Email | Nodemailer + SendGrid |
| Deployment | Vercel (frontend), Railway/Render (backend) |

---

## 7. Success Metrics

- Cart-to-checkout conversion rate > 3%
- Page load time < 2s on 4G
- 99.9% uptime SLA
- Customer satisfaction score > 4.5/5

---

## 8. Timeline (Estimated)

| Phase | Duration | Deliverables |
|---|---|---|
| Phase 1 – Setup | Week 1 | Repo, CI/CD, env config, DB schema |
| Phase 2 – Core | Weeks 2–5 | Auth, Products, Cart, Checkout |
| Phase 3 – Admin | Weeks 6–7 | Dashboard, order/product mgmt |
| Phase 4 – Polish | Week 8 | SEO, performance, mobile QA |
| Phase 5 – Launch | Week 9 | Deploy, monitoring, go-live |
