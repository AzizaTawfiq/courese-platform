# MA Training Platform — Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-07

## Active Technologies

- TypeScript strict mode — frontend (Vue 3 + Vite), backend (Node.js + Express) (main)
- Pinia (Composition API stores), Vue Router 4, Axios, VeeValidate v4 + Zod
- vue-i18n v9 (ar/en), @vueuse/head, Tailwind CSS v3 + tailwindcss-rtl
- Prisma ORM, PostgreSQL, Redis (ioredis), bcryptjs, jsonwebtoken, Multer

## Project Structure

```text
frontend/src/
  modules/customer/   # Customer portal (views, components, routes.ts)
  modules/admin/      # Admin portal (views, components, routes.ts)
  layouts/            # PublicLayout, CustomerLayout, AdminLayout
  shared/             # stores/, services/, composables/, types/, schemas/
  locales/            # ar.json, en.json

backend/src/
  modules/            # auth, programs, categories, courses, schedules, purchases, bookings, admin
  middleware/         # auth.ts, requireRole.ts, validate.ts, rateLimiter.ts
  services/           # cache.service.ts, sitemap.service.ts, upload.service.ts
  prisma/             # schema.prisma, migrations/
```

## Commands

```bash
# Frontend
cd frontend && pnpm dev          # Start Vite dev server (port 5173)
cd frontend && pnpm build        # Production build
cd frontend && pnpm tsc --noEmit # Type check
cd frontend && pnpm lint         # ESLint

# Backend
cd backend && pnpm dev           # Start Express (port 3000)
cd backend && pnpm tsc --noEmit  # Type check
cd backend && pnpm lint          # ESLint
cd backend && pnpm prisma migrate dev  # Run migrations
cd backend && pnpm prisma db seed      # Seed admin account + sample data
```

## Constitution Gates (enforce before every PR)

1. `tsc --noEmit` passes in both frontend and backend
2. All new public pages have complete `useHead()` blocks via `useSeo.ts`
3. All forms use VeeValidate + Zod resolver (no raw v-model state)
4. All API write operations invalidate Redis cache
5. No Vite chunk exceeds 250 KB gzipped
6. Both AR and EN layouts verified visually
7. WCAG 2.1 AA confirmed for new UI
8. All GET listing endpoints use Redis caching middleware

## Key Conventions

- Components: `<script setup lang="ts">` only — no Options API
- Styles: Tailwind logical properties only (`ms-`, `me-`, `ps-`, `pe-`)
- Stores: `useAuthStore`, `useProgramsStore`, `useCoursesStore`, `useBookingsStore`, `useUIStore`
- HTTP: all calls through typed service files in `src/shared/services/`
- Public URLs: slug-based only — no numeric IDs
- API routes: versioned under `/api/v1/`
- Security: JWT in Pinia memory only; refresh token in `__rt` HTTP-only cookie

## Recent Changes

- main: Initial platform setup — dual-portal Vue 3 SPA + Express/Prisma backend

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
