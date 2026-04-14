# Quickstart: Dual-Portal Corporate Training Platform

**Date**: 2026-04-07
**Branch**: `001-dual-portal-training-platform`

This guide covers getting the full platform running locally for development.

---

## Prerequisites

- Node.js 20+ (`node --version`)
- pnpm 8+ (`npm install -g pnpm`)
- PostgreSQL 15+ running locally or via Docker
- Redis 7+ running locally or via Docker
- Git

---

## 1. Clone & Install

```bash
git clone <repo-url> ma-training-platform
cd ma-training-platform

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

---

## 2. Environment Variables

**Backend** — copy and fill `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ma_training"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_ACCESS_SECRET="<at-least-32-char-random-string>"
JWT_REFRESH_SECRET="<at-least-64-char-random-string>"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# CORS
CORS_ORIGINS="http://localhost:5173,http://localhost:4173"

# File uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10

# App
PORT=3000
NODE_ENV=development
BASE_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
```

**Frontend** — copy and fill `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SITE_URL=http://localhost:5173
```

---

## 3. Database Setup

```bash
cd backend

# Run migrations (creates all tables)
pnpm prisma migrate dev

# Seed initial admin account and sample data
pnpm prisma db seed
```

The seed script creates:
- One `SUPER_ADMIN` user: `admin@matraining.com` / `Admin@12345`
- One sample Program with one Category and two Courses

---

## 4. Start Development Servers

**Terminal 1 — Backend**:
```bash
cd backend
pnpm dev
# Express API running at http://localhost:3000
```

**Terminal 2 — Frontend**:
```bash
cd frontend
pnpm dev
# Vite dev server running at http://localhost:5173
```

---

## 5. Verify the Setup

| Check | URL | Expected |
|---|---|---|
| API health | `GET http://localhost:3000/health` | `{ "status": "ok" }` |
| Programs list | `GET http://localhost:3000/api/v1/programs` | JSON with seeded program |
| Sitemap | `GET http://localhost:3000/sitemap.xml` | Valid XML sitemap |
| Robots | `GET http://localhost:3000/robots.txt` | Disallow rules present |
| Landing page | `http://localhost:5173/` | Customer portal landing page |
| Admin login | `http://localhost:5173/admin/login` | Admin login form |

---

## 6. Key Development Workflows

### Run type checks
```bash
# Frontend
cd frontend && pnpm tsc --noEmit

# Backend
cd backend && pnpm tsc --noEmit
```

### Run linter
```bash
cd frontend && pnpm lint
cd backend && pnpm lint
```

### Generate Prisma client after schema changes
```bash
cd backend && pnpm prisma generate
```

### Create a new DB migration
```bash
cd backend && pnpm prisma migrate dev --name <migration-name>
```

### Clear Redis cache (development)
```bash
redis-cli FLUSHDB
```

---

## 7. Admin Portal Access

1. Open `http://localhost:5173/admin/login`
2. Log in with `admin@matraining.com` / `Admin@12345`
3. Navigate to Programs → Create Program to add content

---

## 8. Testing the Bilingual Experience

1. On any public page, click the language switcher in the navigation.
2. The page content, layout direction, and meta tags update instantly.
3. In Arabic mode: page `dir="rtl"`, navigation and layout mirror.
4. In English mode: page `dir="ltr"`, standard left-to-right layout.

---

## 9. Testing SEO Outputs

```bash
# Inspect a course page meta tags (after seeding)
curl -s http://localhost:5173/programs/sample-program/courses/sample-course \
  | grep -E '<title>|<meta name="description"|<link rel="canonical"|hreflang'
```

---

## 10. Constitution Gates — Pre-PR Checklist

Before opening a pull request, verify all 8 gates from the constitution:

```bash
# 1. TypeScript: zero errors
cd frontend && pnpm tsc --noEmit
cd backend && pnpm tsc --noEmit

# 2–3. Manual: confirm useHead() on all new public pages, VeeValidate+Zod on all forms

# 4. Manual: confirm Redis invalidation on all new write endpoints

# 5. Bundle size check
cd frontend && pnpm build && pnpm analyze

# 6. Manual: test AR and EN layouts in browser

# 7. Manual: run axe DevTools or Lighthouse accessibility audit

# 8. Manual: confirm GET listing endpoints use Redis middleware
```
