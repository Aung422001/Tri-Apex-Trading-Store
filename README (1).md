# 🖨️ Triapex Trading Group — 3D Printer E-Commerce Platform

> Professional full-stack e-commerce platform for 3D printers, filaments, and accessories.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 15
- Redis >= 7
- pnpm (recommended) or npm

### 1. Clone & Install
```bash
git clone https://github.com/triapex/3d-printer-store.git
cd 3d-printer-store
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your environment variables (see .env.example)
```

### 3. Database Setup
```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

### 4. Run Development Servers

**Backend (port 5000):**
```bash
cd backend
pnpm dev
```

**Frontend (port 3000):**
```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
triapex-3d-store/
├── frontend/                  # Next.js 14 app
│   ├── app/                   # App router pages
│   │   ├── (shop)/            # Public store pages
│   │   ├── (auth)/            # Auth pages
│   │   ├── dashboard/         # User dashboard
│   │   └── admin/             # Admin panel
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utilities, API clients
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript types
│
├── backend/                   # Express.js API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── controllers/       # Business logic
│   │   ├── services/          # Service layer
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── prisma/            # DB schema & migrations
│   │   └── utils/             # Helper functions
│   └── tests/                 # API tests
│
├── shared/                    # Shared types between frontend & backend
├── .env.example               # Environment variable template
├── package.json               # Root workspace config
├── prd.md                     # Product Requirements Document
├── implementation.md          # Implementation guide
├── frontend.md                # Frontend architecture guide
├── backend.md                 # Backend architecture guide
└── gemini.md                  # AI integration guide
```

---

## 🔑 Key Features

- 🛒 Full e-commerce with cart, checkout, and payment
- 🔐 JWT auth with Google OAuth
- 📦 Real-time order tracking
- 🤖 AI-powered product recommendations (Gemini)
- 📊 Admin dashboard with analytics
- 📱 Mobile-first responsive design
- 🔍 SEO optimized (SSR + metadata)
- 🎨 Dark/light mode

---

## 🛠️ Tech Stack

| | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js, TypeScript, Prisma |
| **Database** | PostgreSQL, Redis |
| **Auth** | JWT, NextAuth.js, Google OAuth |
| **Payments** | Stripe, PayPal |
| **AI** | Google Gemini API |
| **Storage** | Cloudinary |
| **Email** | SendGrid |

---

## 📜 Available Scripts

### Root
```bash
pnpm dev          # Start all services (requires concurrently)
pnpm build        # Build frontend & backend
pnpm lint         # Lint all packages
pnpm test         # Run all tests
```

### Backend
```bash
pnpm prisma studio          # Open Prisma DB GUI
pnpm prisma migrate dev     # Run DB migrations
pnpm prisma db seed         # Seed demo data
```

---

## 🌐 API Documentation

API docs available at: `http://localhost:5000/api/docs` (Swagger UI)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'feat: add your feature'`
3. Push and open a Pull Request

---

## 📄 License

MIT © Triapex Trading Group
