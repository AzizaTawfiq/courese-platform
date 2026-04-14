# Research: Dual-Portal Corporate Training Platform

**Phase**: 0 — Outline & Research
**Date**: 2026-04-07
**Branch**: `001-dual-portal-training-platform`

---

## 1. Lazy-Loaded Dual-Portal Module Architecture (Vue 3 + Vite)

**Decision**: Two top-level lazy-loaded modules (`modules/customer`, `modules/admin`)
with Vite manual chunking via `build.rollupOptions.output.manualChunks`.

**Rationale**: Lazy loading at module level means the admin bundle is never sent to
customer browsers and vice versa. Manual chunking keeps each chunk under the 250 KB
gzipped constitutional limit. Each module has its own `routes.ts` imported into the
root router to avoid a monolithic routes file.

**Implementation pattern**:
```ts
// router/index.ts
const customerRoutes = () => import('@/modules/customer/routes')
const adminRoutes    = () => import('@/modules/admin/routes')
```

**Alternatives considered**:
- Single SPA with route-level lazy loading — rejected because admin components
  would still be included in the common chunk.
- Separate Vite projects (micro-frontends) — rejected; adds deployment complexity
  disproportionate to scale.

---

## 2. RTL/LTR Switching with tailwindcss-rtl

**Decision**: `tailwindcss-rtl` plugin with logical utility classes (`ms-`, `me-`,
`ps-`, `pe-`, `text-start`, `text-end`). Direction driven by `document.documentElement.dir`
set reactively by `useUIStore` when locale changes.

**Rationale**: Logical properties flip automatically based on `dir` attribute without
any CSS duplication. No per-locale stylesheet needed.

**Implementation pattern**:
```ts
// stores/ui.ts — watch locale, update dir
watch(locale, (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
})
```

**Alternatives considered**:
- Manual `rtl:` variant prefixes in every component — rejected; fragile and verbose.
- CSS custom properties with `[dir=rtl]` selectors — rejected; duplicates spacing
  values and breaks Tailwind's utility-first model.

---

## 3. JWT + Refresh Token Strategy

**Decision**:
- Access token: 15-minute expiry, returned in JSON response body, stored in
  `useAuthStore` Pinia store (JavaScript memory only — never persisted).
- Refresh token: 7-day expiry, stored in HTTP-only `SameSite=Strict Secure` cookie
  named `__rt`.
- Refresh rotation: Every successful refresh call issues a new refresh token
  (one-time-use). The old token is invalidated in a Redis allowlist.

**Rationale**: Memory-only access token eliminates XSS-based token theft from storage.
HTTP-only cookie makes the refresh token invisible to JavaScript, preventing CSRF-based
replay when combined with `SameSite=Strict`. Refresh rotation limits the damage window
of a stolen refresh token.

**Axios interceptor sequence**:
1. Request interceptor: attach `Authorization: Bearer <access_token>` from store.
2. Response interceptor on 401: call `POST /api/v1/auth/refresh` (cookie sent
   automatically), receive new access token in body, update store, retry original
   request once.
3. If refresh also returns 401: call `useAuthStore.logout()`, redirect to `/login`.

**Alternatives considered**:
- Access token in `localStorage` — rejected; XSS risk.
- Access token in cookie — rejected; CSRF risk without SameSite enforcement, and
  cannot be read by the Axios interceptor cleanly.

---

## 4. Redis Caching Strategy

**Decision**:
- All `GET /api/v1/programs`, `/categories`, `/courses` listing endpoints: cache
  in Redis with key pattern `cache:list:<resource>:<locale>:<page>`, TTL 5 minutes.
- Individual entity `GET`: key `cache:entity:<type>:<slug>`, TTL 10 minutes.
- `GET /sitemap.xml`: key `cache:sitemap`, TTL 1 hour.
- Invalidation: every POST/PUT/PATCH/DELETE on a resource calls
  `cacheService.invalidatePrefix('cache:list:<resource>')` and
  `cacheService.del('cache:entity:<type>:<slug>')` immediately after DB write.

**Rationale**: Listing pages are the highest-traffic endpoints and the most
expensive to render (multiple Prisma joins). Redis eliminates repeated DB hits for
the same data window. Short TTL (5 min) keeps staleness minimal while still
absorbing traffic spikes.

**Alternatives considered**:
- In-memory Node.js cache (node-cache) — rejected; not shared across multiple
  backend instances; lost on restart.
- CDN edge caching only — rejected; cannot invalidate on admin writes without
  complex purge APIs.

---

## 5. SEO Head Management (@vueuse/head + useSeo.ts)

**Decision**: A single `useSeo(options: SeoOptions)` composable wraps `useHead()`
from `@vueuse/head`. Every public page imports and calls it with computed properties
so metadata is reactive to locale changes.

**`SeoOptions` interface**:
```ts
interface SeoOptions {
  titleKey: string            // i18n key for title suffix
  descriptionKey: string      // i18n key for meta description
  canonicalPath: string       // e.g. /programs/intro-to-pm
  ogType?: 'website' | 'article'
  jsonLd: object              // pre-built JSON-LD object
}
```

**Rationale**: Composable prevents duplication of `useHead()` call structure across
30+ pages and ensures no field is accidentally omitted. Reactive computed refs mean
the title/description update instantly on locale switch without a page reload.

**Alternatives considered**:
- Per-page `useHead()` calls — rejected; high duplication risk, easy to miss fields.
- SSR with server-rendered meta — deferred to post-launch; Vite SSR adds complexity
  not justified at initial scale.

---

## 6. Sitemap Generation Strategy

**Decision**: Dynamic sitemap generated server-side by `sitemap.service.ts` at
request time, cached in Redis for 1 hour. Served at `GET /sitemap.xml` (Express
route, not static file). Invalidated on any admin CRUD write.

**Sitemap entries per entity**:
- Landing page: `https://domain.com/` (hreflang `ar`, `en`, `x-default`)
- Programs: `https://domain.com/programs/:slug`
- Categories: `https://domain.com/programs/:programSlug/categories/:slug`
- Courses: `https://domain.com/programs/:programSlug/courses/:slug`

**hreflang pattern** (per entry):
```xml
<xhtml:link rel="alternate" hreflang="ar" href="https://domain.com/ar/programs/slug"/>
<xhtml:link rel="alternate" hreflang="en" href="https://domain.com/en/programs/slug"/>
<xhtml:link rel="alternate" hreflang="x-default" href="https://domain.com/en/programs/slug"/>
```

**Alternatives considered**:
- Static sitemap generated at build time — rejected; content changes frequently
  via admin; rebuild per content update is impractical.
- Third-party sitemap service — rejected; unnecessary external dependency.

---

## 7. File Upload Architecture (Schedule File)

**Decision**: Multer middleware on `POST /api/v1/admin/schedule-file`. Accepted MIME
types: `application/pdf`, `application/vnd.ms-excel`,
`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Max 10 MB.
File stored on disk (or cloud storage bucket if environment variable `STORAGE=s3`
is set). A `ScheduleFile` DB record stores filename, original name, upload date, and
public URL.

**Download endpoint**: `GET /api/v1/schedule-file/download` — no auth required.
Returns 302 redirect to the file URL, or 404 if no file uploaded.

**Alternatives considered**:
- Store file in PostgreSQL as bytea — rejected; inefficient for binary blobs,
  not scalable.
- Direct S3 presigned upload from browser — deferred to scale phase; disk storage
  sufficient for initial launch.

---

## 8. Slug Generation and 301 Redirect Tracking

**Decision**: Backend slug generation function: lowercase English name, replace
spaces/special chars with `-`, strip non-alphanumeric (except `-`), collapse
multiple `-` into one. Stored in DB with unique constraint per entity type.

**Slug change tracking**: When an admin updates a slug, the old slug is stored in
a `SlugRedirect` table (`old_slug`, `new_slug`, `entity_type`, `entity_id`).
The Express router catches unresolved public slugs and checks this table before
returning 404, issuing a 301 to the new slug path.

**Alternatives considered**:
- Immutable slugs (no editing) — rejected; admins must be able to correct
  mistakes; SEO preservation requires redirect tracking.
- URL shortener service — rejected; unnecessary external dependency for internal slugs.

---

## 9. Payment Processing Approach

**Decision**: Deferred to planning phase as an implementation decision. The spec
establishes the user journey (select slot → checkout → confirmation). Integration
with a third-party gateway (e.g., Stripe, HyperPay for MENA region) will be scoped
separately. For Phase 1 implementation, a `Purchase` record with `status: PENDING`
is created, and a payment webhook handler will update it to `CONFIRMED`.

**Rationale**: Payment gateway selection depends on the target market's preferred
providers and the client's merchant account. The platform architecture (purchase
record + webhook) is gateway-agnostic.

---

## 10. Admin Account Provisioning

**Decision**: Admin accounts are created by a seed script or a protected
`POST /api/v1/admin/users` endpoint accessible only to `SUPER_ADMIN` role. No
self-service admin registration UI.

**Roles**:
- `CUSTOMER` — customer portal access only
- `ADMIN` — admin portal full access
- `SUPER_ADMIN` — admin portal + admin user management

**Rationale**: Eliminates admin account enumeration attacks through a registration
form. Provisioned accounts can enforce stronger password requirements at creation time.
