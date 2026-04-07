<!--
SYNC IMPACT REPORT
==================
Version change: [unversioned template] → 1.0.0
Modified principles: N/A (initial population from blank template)
Added sections:
  - Core Principles (I–XIV): 14 principles defined
  - Technical Stack & Architecture
  - Development Workflow & Quality Gates
  - Governance
Removed sections: N/A (template placeholders replaced)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ Constitution Check gates now derivable
  - .specify/templates/spec-template.md ✅ Requirements/constraints aligned
  - .specify/templates/tasks-template.md ✅ Task categories reflect principle-driven types
Deferred TODOs: None — all fields resolved on initial ratification.
-->

# MA Training Platform Constitution

## Core Principles

### I. Vue 3 Composition API & TypeScript Standards (NON-NEGOTIABLE)

All frontend components MUST use `<script setup lang="ts">` with the Vue 3 Composition API.
Options API is prohibited in new code. TypeScript MUST be set to `strict: true` in
`tsconfig.json` — no `any` types, no non-null assertions without explicit justification.

- `defineProps` and `defineEmits` MUST use typed generic syntax.
- `ref<T>()` and `computed<T>()` MUST carry explicit type parameters wherever inference
  is ambiguous.
- Composables live in `src/composables/` and MUST be prefixed `use` (e.g. `useAuth`).
- No `this` keyword — Composition API only.

**Rationale**: Strict TypeScript eliminates entire classes of runtime errors and makes
refactoring safe across a bilingual, dual-portal codebase.

### II. Tailwind CSS Utility-First Styling & RTL/LTR Consistency

All styling MUST use Tailwind CSS utility classes. Custom CSS is permitted only for
animations or pseudo-elements that Tailwind cannot express.

- `tailwindcss-rtl` plugin MUST be used for all directional utilities. Use logical
  properties (`ms-`, `me-`, `ps-`, `pe-`) — never `ml-`, `mr-`, `pl-`, `pr-` directly.
- RTL layout MUST be validated in both `dir="rtl"` (AR) and `dir="ltr"` (EN) before
  any component is merged.
- The `dir` attribute is driven by `vue-i18n` locale; components MUST NOT hardcode
  directionality.
- No inline `style` attributes for layout or spacing.

**Rationale**: A corporate platform serving both Arabic and English audiences requires
pixel-consistent bidirectional layout. Logical properties enforce this at the utility
level without per-locale overrides.

### III. Pinia Store Structure & Naming Conventions

State MUST be managed exclusively through Pinia stores using the Composition API store
style (`defineStore` with `setup` function). No Vuex. No component-local reactive state
for cross-component data.

Required stores and their canonical file paths:

| Store | File | Purpose |
|---|---|---|
| `useAuthStore` | `src/stores/auth.ts` | JWT access token (memory), user profile, role |
| `useProgramsStore` | `src/stores/programs.ts` | Program listing, pagination, filters |
| `useCoursesStore` | `src/stores/courses.ts` | Course listing per program, detail cache |
| `useBookingsStore` | `src/stores/bookings.ts` | Customer booking state, status tracking |
| `useUIStore` | `src/stores/ui.ts` | Locale, loading flags, toast notifications |

- Store actions that call the API MUST use the typed Axios service layer (Principle IV).
- Store state MUST NOT be mutated outside of actions.
- Stores MUST be reset on logout via `$reset()` or explicit reset action.

**Rationale**: Centralized, predictably named stores allow both portals to share
business logic without duplication while keeping state mutations auditable.

### IV. Axios Service Layer Architecture

All HTTP calls MUST go through a typed Axios service layer — no raw `fetch`, no ad-hoc
`axios.get()` in components or stores.

- Base instance configured in `src/services/api.ts` with request/response interceptors.
- JWT access token injected via request interceptor from `useAuthStore` (memory only).
- Refresh token rotation handled transparently in the response interceptor: on 401,
  call `POST /api/v1/auth/refresh` with the HTTP-only cookie, update access token in
  memory, retry the original request.
- Each domain has its own service file: `authService.ts`, `programsService.ts`,
  `coursesService.ts`, `bookingsService.ts`, `adminService.ts`.
- Every service method MUST have explicit TypeScript request and response interfaces
  defined in `src/types/` (e.g. `ProgramListResponse`, `CreateBookingRequest`).
- Never return raw `AxiosResponse` — unwrap to the typed payload in the service method.

**Rationale**: A single interceptor layer enforces auth refresh logic uniformly and
prevents scattered, inconsistent API call patterns across components.

### V. VeeValidate + Zod Schema-First Form Validation

Every user-facing form input MUST be validated using VeeValidate with a Zod schema as
the resolver. Validation logic lives in the schema, not in component methods.

- Zod schemas are defined in `src/schemas/` and imported by the form component.
- `useForm` from VeeValidate MUST receive the `zodResolver` adapter.
- All fields MUST show inline validation errors on blur and on submit attempt.
- Server-side validation errors (422 responses) MUST be mapped back to VeeValidate
  field errors using `setErrors`.
- Form submission buttons MUST be disabled while `isSubmitting` is true.
- No `v-model` bound directly to reactive state without VeeValidate — use `useField`.

**Rationale**: Schema-first validation ensures frontend and backend validation rules
stay aligned (both use Zod) and eliminates duplicated validation logic.

### VI. SEO Standards — @vueuse/head (NON-NEGOTIABLE)

Every public-facing page MUST call `useHead()` with the full SEO block. Deploying a
public page without complete SEO metadata is a merge blocker.

Required fields per public page:

```ts
useHead({
  title: '<unique page title | MA Training Platform>',
  meta: [
    { name: 'description', content: '<unique, ≤160 chars>' },
    { property: 'og:title', content: '...' },
    { property: 'og:description', content: '...' },
    { property: 'og:url', content: '<canonical URL>' },
    { property: 'og:type', content: 'website' | 'article' },
    { rel: 'canonical', href: '<canonical URL>' },
  ],
  link: [
    { rel: 'alternate', hreflang: 'ar', href: '<AR URL>' },
    { rel: 'alternate', hreflang: 'en', href: '<EN URL>' },
    { rel: 'alternate', hreflang: 'x-default', href: '<EN URL>' },
  ],
  script: [{ type: 'application/ld+json', children: JSON.stringify(<JsonLdObject>) }],
})
```

- Title MUST be unique across all pages and include the brand suffix.
- JSON-LD MUST use `Course`, `EducationalOrganization`, or `BreadcrumbList` schema
  as appropriate.
- SEO values MUST be reactive to locale changes (computed from `t()` or bilingual
  entity fields).

**Rationale**: Search engine visibility is a primary acquisition channel. Incomplete or
duplicate metadata directly harms organic rankings.

### VII. Slug-Based URL Conventions

All public content routes MUST use human-readable, locale-neutral slugs. Numeric IDs
MUST NOT appear in public URLs.

- Slugs are generated server-side from the English name, lowercased, hyphenated,
  deduplicated (see Principle XIV).
- Route pattern: `/programs/:slug`, `/programs/:programSlug/courses/:courseSlug`.
- Router params are always named `slug`, `programSlug`, or `courseSlug` — never `id`.
- Admin routes may use IDs internally (`/admin/programs/42/edit`) but MUST display
  the slug in the SEO panel.
- Slug changes MUST trigger a 301 redirect from the old slug (tracked in DB).

**Rationale**: Slug-based URLs are indexable, shareable, and language-agnostic,
supporting the bilingual SEO strategy.

### VIII. Node.js + Express API Conventions

All backend routes MUST be versioned under `/api/v1/` and follow RESTful resource
naming. No unversioned routes exposed to the frontend.

- Route files live in `backend/src/routes/v1/` grouped by resource.
- Every request body and query parameter MUST be validated with a Zod schema before
  reaching the controller. Invalid requests return `400` with structured error details.
- Controllers MUST be thin — business logic lives in service classes under
  `backend/src/services/`.
- All Prisma queries MUST use typed return types; avoid `prisma.$queryRaw` unless
  strictly necessary and parameterized.
- Every write operation (POST/PUT/PATCH/DELETE) MUST invalidate the relevant Redis
  cache keys immediately after the DB write succeeds.
- Errors MUST be passed to the Express error handler via `next(err)` — no
  `res.json({ error })` patterns in route handlers.
- HTTP status codes MUST be semantically correct: 201 for creation, 204 for deletion,
  422 for validation failures, 401/403 for auth errors.

**Rationale**: Consistent API conventions allow frontend service types to be generated
or maintained predictably, and Redis invalidation prevents stale data on listing pages.

### IX. Bilingual Content Handling

All content entities (Program, Category, Course) MUST store both Arabic and English
variants in the same database row. No separate locale tables.

Required fields on every content entity:

```
nameAr        String
nameEn        String
descriptionAr String
descriptionEn String
seoTitleAr    String   (≤60 chars, enforced by Zod)
seoTitleEn    String   (≤60 chars, enforced by Zod)
seoDescAr     String   (≤160 chars, enforced by Zod)
seoDescEn     String   (≤160 chars, enforced by Zod)
slug          String   @unique
updatedAt     DateTime @updatedAt
```

- API responses MUST include both locale variants; the frontend selects the active
  locale's fields using a composable (`useLocaleContent(entity)`).
- Slug is locale-neutral (generated from English name).
- Admin forms MUST present both AR and EN fields side by side.

**Rationale**: Storing both locales in one row simplifies queries, avoids join
complexity, and ensures slug uniqueness is enforced at the database level.

### X. Security Standards (NON-NEGOTIABLE)

Security violations are immediate merge blockers — no exceptions.

- **JWT**: Access token stored in memory only (`useAuthStore`). MUST NOT be stored in
  `localStorage`, `sessionStorage`, or any cookie.
- **Refresh token**: Stored exclusively in an HTTP-only, `SameSite=Strict`, `Secure`
  cookie. Never accessible from JavaScript.
- **Password hashing**: `bcrypt` with a minimum cost factor of 12. No MD5/SHA-1/SHA-256
  for passwords.
- **CORS**: `Access-Control-Allow-Origin` MUST be restricted to an explicit allowlist of
  trusted origins from environment config. Wildcard `*` is prohibited.
- **Rate limiting**: Auth endpoints (`/login`, `/refresh`) MUST have rate limiting
  applied (e.g. `express-rate-limit`).
- **Input sanitisation**: All user-supplied content rendered as HTML MUST be sanitised
  with DOMPurify before rendering.
- No secrets, API keys, or credentials in source code or `.env` files committed to VCS.

**Rationale**: Corporate training platforms process employee data. A single auth
vulnerability can expose all customer bookings and PII.

### XI. Module Isolation — Customer & Admin Portals

The Customer Portal and Admin Portal MUST be fully isolated lazy-loaded modules. No
cross-portal component imports are permitted.

Enforced folder structure:

```
src/
  modules/
    customer/
      views/          # Customer-facing pages only
      components/     # Customer-specific components only
      routes.ts       # Customer router config
      CustomerLayout.vue
    admin/
      views/          # Admin pages only
      components/     # Admin-specific components only
      routes.ts       # Admin router config
      AdminLayout.vue
  shared/
    components/       # Only truly shared UI primitives (Button, Input, etc.)
    composables/
    stores/
    services/
    types/
```

- Router guards MUST enforce role-based access: Customer routes require `role: CUSTOMER`,
  Admin routes require `role: ADMIN` or `role: SUPER_ADMIN`.
- Lazy loading MUST be applied at the module level:
  `component: () => import('@/modules/customer/views/HomePage.vue')`.
- Each module has its own `routes.ts` — no monolithic router file.

**Rationale**: Module isolation prevents accidental exposure of admin functionality to
customers and keeps bundle chunks cleanly separated for performance.

### XII. Performance Requirements

Performance targets are CI-enforced gates, not aspirational goals.

| Metric | Threshold | Enforcement |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5 s | Lighthouse CI |
| Vite chunk size (gzipped) | < 250 KB per chunk | `vite-bundle-analyzer` in CI |
| Redis cache | All `GET /api/v1/` listing endpoints | Code review gate |
| `sitemap.xml` | Cached in Redis, invalidated on any CRUD | Backend service contract |
| First Contentful Paint | < 1.8 s | Lighthouse CI |

- Images MUST use WebP format with explicit `width`/`height` attributes and lazy loading
  (`loading="lazy"`) for below-the-fold content.
- Fonts MUST be `font-display: swap` with `<link rel="preconnect">` in `index.html`.
- No synchronous third-party scripts in the `<head>`.
- Redis cache TTL for listing endpoints: 5 minutes. TTL for individual entity: 10
  minutes. Invalidated immediately on write.

**Rationale**: LCP and chunk size directly impact SEO rankings and conversion rates on
corporate training platforms accessed on varied network conditions.

### XIII. Accessibility — WCAG 2.1 AA

All UI MUST meet WCAG 2.1 AA conformance. Accessibility failures are merge blockers.

- Exactly one `<h1>` per page — always the primary page title.
- Heading hierarchy MUST be logical: `h1 → h2 → h3`, no skipped levels.
- All interactive elements MUST be keyboard-navigable (Tab, Enter, Space, Escape,
  arrow keys where applicable).
- All images MUST have meaningful `alt` attributes (empty `alt=""` for decorative images).
- Form fields MUST have associated `<label>` or `aria-label`. Error messages MUST use
  `aria-live="assertive"` or `role="alert"`.
- Color contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text.
- Modal dialogs MUST trap focus and restore it on close.
- RTL layouts MUST not break keyboard navigation order.

**Rationale**: Corporate clients may have contractual accessibility obligations. WCAG AA
compliance is also a ranking signal for some search engines.

### XIV. Admin SEO Panel Standards

Every admin content form (Program, Category, Course) MUST include a standardised SEO
panel component. No content entity is saveable without valid SEO metadata.

- `seoTitle` (AR + EN): MUST show real-time character counter, MUST enforce max 60 chars
  with a Zod `max(60)` constraint. Counter turns red at > 50 chars.
- `seoDescription` (AR + EN): MUST show real-time character counter, MUST enforce max
  160 chars with Zod `max(160)`. Counter turns red at > 140 chars.
- **SERP Preview Component** (`SerpPreview.vue`): Live preview showing title (truncated
  at 60 chars), URL with slug, and description (truncated at 160 chars), styled to match
  Google's search result appearance.
- **Slug field**: Auto-generated from English name on creation. Editable by admin.
  MUST validate uniqueness via `GET /api/v1/admin/slugs/check?slug=<value>&type=<entity>`
  with debounce (300 ms). Duplicate slugs MUST show an inline error and block save.
- Slug MUST match pattern `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (validated by Zod on both
  frontend and backend).

**Rationale**: Consistent SEO metadata quality requires tooling that enforces limits and
provides immediate visual feedback, reducing reliance on post-publication audits.

## Technical Stack & Architecture

**Frontend**: Vue 3 + Vite + TypeScript (strict) + Tailwind CSS + tailwindcss-rtl
**State**: Pinia (Composition API style)
**Routing**: Vue Router 4 with lazy-loaded module routes and role guards
**i18n**: vue-i18n v9 — locales `ar` / `en`, RTL driven by `document.dir`
**Forms**: VeeValidate 4 + Zod resolvers
**HTTP**: Axios with JWT interceptor and refresh rotation
**SEO**: @vueuse/head
**Backend**: Node.js + Express + TypeScript
**ORM**: Prisma with PostgreSQL
**Cache**: Redis (ioredis)
**Auth**: JWT (memory) + HTTP-only refresh cookie + bcrypt (cost 12)

All stack choices are fixed for this platform version. Deviations require a constitution
amendment (see Governance).

## Development Workflow & Quality Gates

**Before opening a PR**:
1. `tsc --noEmit` passes with zero errors.
2. All new public pages have complete `useHead()` blocks (Principle VI).
3. All new forms use VeeValidate + Zod (Principle V).
4. All new API write operations invalidate Redis cache (Principle VIII).
5. Bundle analyzer confirms no new chunk exceeds 250 KB gzipped (Principle XII).
6. Both AR and EN layouts verified visually in browser (Principle II).
7. WCAG AA pass confirmed for new UI (Principle XIII).
8. `GET` listing endpoints confirmed to have Redis caching (Principle XII).

**Merge blockers** (block PR merge without exception):
- Any security violation (Principle X).
- Public page missing SEO metadata (Principle VI).
- Cross-portal component imports (Principle XI).
- Accessibility failures (Principle XIII).

**Code review checklist**:
- Constitution Check section in `plan.md` MUST be completed before implementation
  begins on any feature.
- Reviewers MUST verify slug uniqueness validation is present on all new slug fields
  (Principle XIV).

## Governance

This constitution supersedes all other documented practices for the MA Training Platform.
Any conflict between this document and a README, wiki, or comment in code is resolved
in favour of this constitution.

**Amendment procedure**:
1. Raise a proposal in a dedicated PR with a description of the change and rationale.
2. At least one senior engineer MUST review and approve.
3. Update `LAST_AMENDED_DATE` and increment `CONSTITUTION_VERSION` per semver rules:
   - MAJOR: principle removed, redefined, or governance restructured.
   - MINOR: new principle or section added, or materially expanded guidance.
   - PATCH: clarifications, wording, typo fixes.
4. Update the Sync Impact Report comment at the top of this file.
5. Propagate changes to affected templates (see checklist in execution flow).

**Compliance reviews**: Constitution compliance MUST be reviewed at the start of each
sprint planning. Any drift from principles discovered during review is a P1 fix.

**Runtime guidance**: For agent-assisted development workflows, refer to the
`.specify/` directory for plan, spec, and task templates which reference these
principles.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
