# Implementation Plan: Dual-Portal Corporate Training Platform

**Branch**: `001-dual-portal-training-platform` | **Date**: 2026-04-07 | **Spec**: [spec.md](../001-dual-portal-training-platform/spec.md)
**Input**: Feature specification from `/specs/001-dual-portal-training-platform/spec.md`

## Summary

Build a dual-portal web application that lets corporate HR managers and training
coordinators discover, purchase, and book certified training courses online —
replacing manual phone/email/PDF processes. The platform serves two isolated portals:
a public-facing Customer Portal (browsing, registration, checkout, booking dashboard)
and a secured Admin Portal (content CRUD, SEO management, schedule file upload).
Both portals share a single Vue 3 + TypeScript frontend monorepo with lazy-loaded
modules, a Node.js/Express/Prisma backend, PostgreSQL primary store, Redis caching,
full Arabic/English bilingual support with RTL/LTR layout, and complete on-page SEO
for every public content route.

## Technical Context

**Language/Version**: TypeScript strict mode — frontend (Vue 3 + Vite), backend (Node.js + Express)
**Primary Dependencies**:
- Frontend: Vue 3, Vite, Pinia, Vue Router 4, Axios, VeeValidate v4, Zod, vue-i18n v9,
  @vueuse/head, Tailwind CSS v3, tailwindcss-rtl
- Backend: Express, Prisma ORM, ioredis, bcryptjs, jsonwebtoken, Multer, Zod
**Storage**: PostgreSQL (primary data), Redis (listing cache TTL 5 min, sitemap TTL 1 hr)
**Testing**: Vitest + Vue Test Utils (frontend unit), Jest + Supertest (backend integration)
**Target Platform**: Web — modern evergreen browsers; frontend on Vercel, backend on Node.js host
**Project Type**: Web application — dual-portal SPA (Vue 3) + REST API (Express)
**Performance Goals**: LCP < 2.5 s; FCP < 1.8 s; no Vite chunk > 250 KB gzipped
**Constraints**: JWT in memory only; refresh token in HTTP-only cookie; CORS allowlist;
  Redis invalidation on every write; slug-based public URLs; WCAG 2.1 AA
**Scale/Scope**: B2B corporate training — initial launch targeting hundreds of companies
  with moderate concurrent load; horizontal scaling deferred to post-launch

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Gate | Principle | Status |
|------|-----------|--------|
| `<script setup lang="ts">` on all components, no Options API | I | PASS — enforced by TypeScript strict config and linting rules |
| `tailwindcss-rtl` logical properties only (`ms-`, `me-`, `ps-`, `pe-`) | II | PASS — tailwindcss-rtl plugin configured; `ml-`/`mr-` disallowed via ESLint |
| Five canonical Pinia stores with Composition API style | III | PASS — auth, programs, courses, bookings, ui defined in design |
| All HTTP calls via typed Axios service layer with typed interfaces | IV | PASS — service files per domain under `src/services/` |
| All forms use VeeValidate + Zod resolver, no raw v-model state | V | PASS — enforced by checklist gate before merge |
| Every public page has full `useHead()` block via `useSeo.ts` composable | VI | PASS — composable defined in Phase 1; merge blocker |
| All public routes use slug-based URLs; no numeric IDs in public paths | VII | PASS — router configured with `:slug` params only |
| All backend routes under `/api/v1/`, Zod validation, Redis invalidation on writes | VIII | PASS — module structure enforces this |
| Program/Category/Course entities carry both AR/EN fields + SEO fields + slug + updatedAt | IX | PASS — Prisma schema defined in data-model.md |
| JWT in memory, refresh in HTTP-only cookie, bcrypt 12 rounds, CORS allowlist | X | PASS — auth design in research.md |
| modules/customer and modules/admin fully isolated; no cross-portal imports | XI | PASS — enforced by folder structure and ESLint import rules |
| LCP < 2.5 s, chunks < 250 KB gzipped, Redis on all listing GETs | XII | PASS — Vite manual chunks + Redis middleware in design |
| One H1 per page, ARIA labels, keyboard nav, WCAG 2.1 AA | XIII | PASS — checklist gate before merge |
| seoTitle ≤ 60 chars, seoDescription ≤ 160 chars, SERP preview, slug dedup | XIV | PASS — SerpPreview.vue component + Zod constraints in admin forms |

**Post-Phase-1 re-check**: All 14 gates confirmed PASS after data model and contracts
review. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/main/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    ├── api-auth.md
    ├── api-programs.md
    ├── api-categories.md
    ├── api-courses.md
    ├── api-schedules.md
    ├── api-bookings.md
    └── api-admin.md

specs/001-dual-portal-training-platform/
└── spec.md              # Feature specification (source of truth)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   └── robots.txt
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/
    │   └── index.ts               # Root router; imports module route arrays
    ├── modules/
    │   ├── customer/
    │   │   ├── views/             # CustomerHome, Programs, Categories, Courses,
    │   │   │   │                  # CourseDetail, Register, Login, Dashboard, Booking
    │   │   ├── components/        # Customer-specific UI components
    │   │   └── routes.ts          # Customer route definitions
    │   └── admin/
    │       ├── views/             # AdminLogin, Programs, ProgramEdit, Categories,
    │       │   │                  # Courses, CourseEdit, Schedules, ScheduleFile
    │       ├── components/        # SerpPreview.vue, SeoPanel.vue, SlugField.vue
    │       └── routes.ts          # Admin route definitions
    ├── layouts/
    │   ├── PublicLayout.vue       # Landing page + public content pages
    │   ├── CustomerLayout.vue     # Authenticated customer pages
    │   └── AdminLayout.vue        # Admin portal pages
    ├── shared/
    │   ├── components/            # Button, Input, Modal, Spinner, etc.
    │   ├── composables/
    │   │   ├── useSeo.ts          # @vueuse/head wrapper for all public pages
    │   │   ├── useLocaleContent.ts # Picks AR/EN field based on active locale
    │   │   └── useSlugField.ts    # Slug debounce + uniqueness check
    │   ├── stores/
    │   │   ├── auth.ts            # useAuthStore — access token, user, role
    │   │   ├── programs.ts        # useProgramsStore
    │   │   ├── courses.ts         # useCoursesStore
    │   │   ├── bookings.ts        # useBookingsStore
    │   │   └── ui.ts              # useUIStore — locale, loading, toasts
    │   ├── services/
    │   │   ├── api.ts             # Axios base instance + interceptors
    │   │   ├── authService.ts
    │   │   ├── programsService.ts
    │   │   ├── coursesService.ts
    │   │   ├── bookingsService.ts
    │   │   └── adminService.ts
    │   ├── schemas/               # Zod schemas shared between forms
    │   └── types/                 # TypeScript interfaces for API payloads
    └── locales/
        ├── ar.json
        └── en.json

backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── robots.txt                 # Static file served at /robots.txt
└── src/
    ├── app.ts                     # Express app factory
    ├── server.ts                  # Entry point
    ├── middleware/
    │   ├── auth.ts                # JWT verification middleware
    │   ├── requireRole.ts         # Role-based access guard
    │   ├── validate.ts            # Zod request validation middleware
    │   └── rateLimiter.ts         # express-rate-limit for auth endpoints
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.routes.ts
    │   │   └── auth.schema.ts     # Zod schemas for login/register
    │   ├── programs/
    │   │   ├── programs.controller.ts
    │   │   ├── programs.service.ts
    │   │   ├── programs.routes.ts
    │   │   └── programs.schema.ts
    │   ├── categories/
    │   │   └── [same structure]
    │   ├── courses/
    │   │   └── [same structure]
    │   ├── schedules/
    │   │   └── [same structure]
    │   ├── purchases/
    │   │   └── [same structure]
    │   ├── bookings/
    │   │   └── [same structure]
    │   └── admin/
    │       └── [same structure]
    ├── services/
    │   ├── cache.service.ts       # Redis wrapper (get/set/del/invalidate)
    │   ├── sitemap.service.ts     # Generates sitemap.xml XML string
    │   └── upload.service.ts      # Multer config + file management
    └── routes/
        └── index.ts               # Mounts all /api/v1/* module routers

```

**Structure Decision**: Web application — Option 2 (separate frontend/ and backend/ at
repository root). The frontend is a Vue 3 SPA with two lazy-loaded portal modules.
The backend is an Express API with feature-module organization. Both live in the same
git repository (monorepo) for simplicity at this scale.
