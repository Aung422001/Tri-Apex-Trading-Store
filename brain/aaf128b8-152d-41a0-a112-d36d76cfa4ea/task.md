# Forgot Password + Cart Fix

## Backend
- [x] Create .env with Gmail SMTP credentials
- [x] Add PasswordResetToken model to schema.prisma
- [x] Run Prisma migration
- [x] Add forgotPassword + resetPassword to auth.service.ts
- [x] Add handlers to auth.controller.ts
- [x] Add routes to auth.routes.ts
- [x] Add sendPasswordResetEmail to email.service.ts

## Frontend
- [x] Create /forgot-password/page.tsx
- [x] Create /reset-password/page.tsx

## Cart
- [x] Fix CartDrawer.tsx to show product images instead of emoji

## Verification
- [x] Test forgot password email flow in browser
- [x] Test cart image display
