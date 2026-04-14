# Tasks: Dual-Portal Corporate Training Platform

**Input**: Design documents from `/specs/main/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, research.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US7)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo skeleton, toolchain configuration, and environment templates — no
business logic. All tasks can proceed immediately; marked [P] tasks can run in parallel.

- [X] T001 Create monorepo folder structure: `frontend/`, `backend/`, `frontend/src/`, `backend/src/` per plan.md
- [X] T002 [P] Initialise frontend with Vite + Vue 3 + TypeScript (`frontend/package.json`, `frontend/vite.config.ts`, `frontend/tsconfig.json`) — strict mode, path alias `@` → `src/`
- [X] T003 [P] Initialise backend with Node.js + Express + TypeScript (`backend/package.json`, `backend/tsconfig.json`) — strict mode, `rootDir: src`, `outDir: dist`
- [X] T004 [P] Configure frontend ESLint (no Options API, no `ml-`/`mr-` classes) in `frontend/.eslintrc.cjs` and Prettier in `frontend/.prettierrc`
- [X] T005 [P] Configure backend ESLint in `backend/.eslintrc.cjs` and Prettier in `backend/.prettierrc`
- [X] T006 [P] Configure Tailwind CSS v3 + `tailwindcss-rtl` plugin in `frontend/tailwind.config.ts` — register plugin, set `content` paths
- [X] T007 [P] Configure Vite manual chunks in `frontend/vite.config.ts` — separate chunks for `customer`, `admin`, `vendor` (Vue/Pinia/Router), `i18n`; target < 250 KB gzipped each
- [X] T008 [P] Create `backend/.env.example` with all required variables per quickstart.md (DATABASE_URL, REDIS_URL, JWT secrets, CORS_ORIGINS, UPLOAD_DIR, PORT, BASE_URL, FRONTEND_URL)
- [X] T009 [P] Create `frontend/.env.example` with VITE_API_BASE_URL and VITE_SITE_URL
- [X] T010 [P] Create `backend/public/robots.txt` per `api-admin.md` — Allow `/`, Disallow `/admin/`, `/customer/`, `/login`, `/register`, `/api/`; Sitemap pointer
- [X] T011 Create `frontend/public/robots.txt` — same Disallow rules for the SPA origin

**Checkpoint**: Toolchain ready — both `pnpm dev` and `pnpm tsc --noEmit` should run without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure every user story depends on — database schema, cache
layer, auth middleware, shared composables, Pinia stores, and routing skeleton.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Backend Foundation

- [X] T012 Write Prisma schema with all entities from `data-model.md` in `backend/prisma/schema.prisma` — User, RefreshToken, Program, Category, Course, Schedule, Purchase, Booking, ScheduleFile, SlugRedirect enums (Role, BookingStatus, PurchaseStatus)
- [X] T013 Run `pnpm prisma migrate dev --name init` to create migration and generate Prisma client in `backend/prisma/migrations/`
- [X] T014 Implement Redis wrapper in `backend/src/services/cache.service.ts` — typed `get<T>`, `set`, `del`, `invalidatePrefix` methods using ioredis; connect via `REDIS_URL` env var
- [X] T015 [P] Implement JWT auth middleware in `backend/src/middleware/auth.ts` — verifies `Authorization: Bearer` header, attaches `req.user`, returns 401 on failure
- [X] T016 [P] Implement role guard middleware in `backend/src/middleware/requireRole.ts` — accepts variadic roles, returns 403 if `req.user.role` not in list
- [X] T017 [P] Implement Zod validation middleware in `backend/src/middleware/validate.ts` — factory `validate(schema)`, returns 400 with structured `errors` array
- [X] T018 [P] Implement rate limiter middleware in `backend/src/middleware/rateLimiter.ts` — `express-rate-limit`, 10 req/min per IP, used on all auth endpoints
- [X] T019 Create Express app factory in `backend/src/app.ts` — CORS allowlist from `CORS_ORIGINS`, cookie-parser, JSON body parser, static `/uploads` + `/public` dirs, health endpoint `GET /health → { status: "ok" }`
- [X] T020 Create server entry point in `backend/src/server.ts` — imports app, connects Redis, starts on `PORT`
- [X] T021 Create routes index in `backend/src/routes/index.ts` — mounts all `/api/v1/*` module routers (stubs at first)
- [X] T022 Write Prisma seed script in `backend/prisma/seed.ts` — creates one SUPER_ADMIN (`admin@matraining.com` / `Admin@12345`, bcrypt 12 rounds), one sample Program + Category + two Courses + one Schedule + one ScheduleFile record

### Frontend Foundation

- [X] T023 Set up vue-i18n v9 plugin in `frontend/src/main.ts` — load `frontend/src/locales/ar.json` and `frontend/src/locales/en.json`, default locale `ar`, legacy false
- [X] T024 [P] Implement `useUIStore` in `frontend/src/shared/stores/ui.ts` (Composition API) — `locale`, `loading`, `toasts`; watcher sets `document.documentElement.dir` and `.lang` on locale change
- [X] T025 [P] Implement `useAuthStore` in `frontend/src/shared/stores/auth.ts` (Composition API) — `accessToken` (memory only), `user`, `role`; `logout()` clears state and redirects
- [X] T026 [P] Create Axios base instance with interceptors in `frontend/src/shared/services/api.ts` — request interceptor attaches Bearer token; response interceptor on 401 calls `POST /auth/refresh`, retries once, then calls `useAuthStore.logout()`
- [X] T027 Set up Vue Router 4 in `frontend/src/router/index.ts` — lazy-loads `modules/customer/routes` and `modules/admin/routes`; navigation guard reads `useAuthStore`
- [X] T028 [P] Create `PublicLayout.vue` in `frontend/src/layouts/PublicLayout.vue` — top nav (logo, language switcher, login/register links), `<RouterView>`, footer
- [X] T029 [P] Create `CustomerLayout.vue` in `frontend/src/layouts/CustomerLayout.vue` — authenticated nav (dashboard, logout), slot for page content
- [X] T030 [P] Create `AdminLayout.vue` in `frontend/src/layouts/AdminLayout.vue` — sidebar nav (Programs, Categories, Courses, Schedules, Schedule File), logout
- [X] T031 [P] Implement `useSeo.ts` composable in `frontend/src/shared/composables/useSeo.ts` — wraps `useHead()` from `@vueuse/head`; accepts `{ titleKey, descriptionKey, canonicalPath, ogType, jsonLd }`, resolves i18n keys reactively
- [X] T032 [P] Implement `useLocaleContent.ts` composable in `frontend/src/shared/composables/useLocaleContent.ts` — returns correct `nameAr`/`nameEn` field based on active locale from `useUIStore`
- [X] T033 Create `frontend/src/App.vue` root component — mounts RouterView, provides Pinia and i18n; `frontend/src/main.ts` installs all plugins and mounts app

**Checkpoint**: Foundation ready — backend starts, DB migrated, seed runs; frontend router and stores initialised

---

## Phase 3: User Story 1 — Discover & Browse the Training Catalog (Priority: P1) 🎯 MVP

**Goal**: Any visitor can navigate from landing page → Program → Category → Course detail in both AR and EN, with full SEO metadata on every page.

**Independent Test**: Open the app, click a Program, click a Category, click a Course — all content visible in both languages with no login prompt; page titles and meta descriptions change per page.

### Backend — US1

- [X] T034 [P] [US1] Create programs Zod schemas in `backend/src/modules/programs/programs.schema.ts` — `createProgramSchema` (all bilingual fields required, seoTitle ≤ 60, seoDesc ≤ 160, slug regex)
- [X] T035 [P] [US1] Implement `programs.service.ts` in `backend/src/modules/programs/programs.service.ts` — `listPrograms()` with Redis `cache:list:programs`, `getProgramBySlug(slug)` with `cache:entity:program:<slug>`, slug-redirect check returning 301 metadata
- [X] T036 [US1] Implement `programs.controller.ts` in `backend/src/modules/programs/programs.controller.ts` — handlers for `GET /api/v1/programs` and `GET /api/v1/programs/:slug`; apply Redis cache middleware; return 404 or 301 per service
- [X] T037 [US1] Create `programs.routes.ts` in `backend/src/modules/programs/programs.routes.ts` — mount GET handlers; register under `/api/v1/programs` in `backend/src/routes/index.ts`
- [X] T038 [P] [US1] Create categories Zod schemas in `backend/src/modules/categories/categories.schema.ts`
- [X] T039 [P] [US1] Implement `categories.service.ts` in `backend/src/modules/categories/categories.service.ts` — `listCategories(programSlug)` with `cache:list:categories:<programSlug>`, `getCategoryById(id)` with courses array
- [X] T040 [US1] Implement `categories.controller.ts` and `categories.routes.ts` in `backend/src/modules/categories/` — `GET /api/v1/programs/:programSlug/categories` and `GET /api/v1/programs/:programSlug/categories/:id`; register in routes index
- [X] T041 [P] [US1] Create courses Zod schemas in `backend/src/modules/courses/courses.schema.ts`
- [X] T042 [P] [US1] Implement `courses.service.ts` in `backend/src/modules/courses/courses.service.ts` — `listCourses(filters)` with `cache:list:courses:<key>`, `getCourseBySlug(slug)` including schedules with computed `availableSeats = maxCapacity - confirmedBookings`
- [X] T043 [US1] Implement `courses.controller.ts` and `courses.routes.ts` in `backend/src/modules/courses/` — `GET /api/v1/courses` and `GET /api/v1/courses/:slug` with Redis cache middleware; slug-redirect 301; register in routes index
- [X] T044 [US1] Implement `sitemap.service.ts` in `backend/src/services/sitemap.service.ts` — queries all active Programs, Categories, Courses; builds XML with `<url>` per entity including `<xhtml:link>` hreflang `ar`/`en`/`x-default`; TTL 1 hr in `cache:sitemap`
- [X] T045 [US1] Add `GET /sitemap.xml` route in `backend/src/routes/index.ts` — serves cached sitemap XML with `Content-Type: application/xml`

### Frontend — US1

- [X] T046 [P] [US1] Add catalog locale keys to `frontend/src/locales/ar.json` and `frontend/src/locales/en.json` — nav labels, page headings, "No courses", "Available Dates", "Duration", "Price", "Book Now", "No Upcoming Dates", schedule download banner
- [X] T047 [P] [US1] Define TypeScript interfaces in `frontend/src/shared/types/catalog.ts` — `Program`, `Category`, `Course`, `Schedule` (including `availableSeats`), paginated list shapes matching contract responses
- [X] T048 [P] [US1] Implement `programsService.ts` in `frontend/src/shared/services/programsService.ts` — typed `listPrograms()` and `getProgram(slug)` using the Axios base instance
- [X] T049 [P] [US1] Implement `coursesService.ts` in `frontend/src/shared/services/coursesService.ts` — typed `listCourses(filters)` and `getCourse(slug)`
- [X] T050 [P] [US1] Implement `useProgramsStore` in `frontend/src/shared/stores/programs.ts` (Composition API) — `programs`, `currentProgram`, `fetchPrograms()`, `fetchProgram(slug)`
- [X] T051 [P] [US1] Implement `useCoursesStore` in `frontend/src/shared/stores/courses.ts` (Composition API) — `courses`, `currentCourse`, `fetchCourses(filters)`, `fetchCourse(slug)`
- [X] T052 [US1] Create customer module route definitions in `frontend/src/modules/customer/routes.ts` — public routes wrapped in `PublicLayout`: `/` (CustomerHome), `/programs/:slug` (Programs), `/programs/:programSlug/categories/:id` (Categories), `/programs/:slug/courses/:courseSlug` (CourseDetail); auth routes in `CustomerLayout`: `/dashboard`
- [X] T053 [US1] Create `CustomerHome.vue` in `frontend/src/modules/customer/views/CustomerHome.vue` — fetches programs list via `useProgramsStore`; renders program cards linking to `/programs/:slug`; calls `useSeo()` with landing-page JSON-LD `WebSite`; includes `ScheduleBanner` slot
- [X] T054 [US1] Create `Programs.vue` in `frontend/src/modules/customer/views/Programs.vue` — fetches program by `slug` param; shows bilingual name/description via `useLocaleContent`; lists categories as cards; calls `useSeo()` with BreadcrumbList + `EducationalOrganization` JSON-LD
- [X] T055 [US1] Create `Categories.vue` in `frontend/src/modules/customer/views/Categories.vue` — fetches category by `id` param (with parent programSlug); lists courses as cards; calls `useSeo()` with BreadcrumbList JSON-LD
- [X] T056 [US1] Create `CourseDetail.vue` in `frontend/src/modules/customer/views/CourseDetail.vue` — fetches course by `courseSlug`; shows bilingual name, description, duration, price, currency; renders schedule slots with dates, location, seat availability; shows "No Upcoming Dates" when no active schedules; calls `useSeo()` with `schema.org/Course` JSON-LD
- [X] T057 [US1] Add language switcher component `LanguageSwitcher.vue` in `frontend/src/shared/components/LanguageSwitcher.vue` — toggles `useUIStore.locale` between `ar` and `en`; updates `document.dir`; integrate in `PublicLayout.vue` nav
- [X] T058 [US1] Verify all four public views (`CustomerHome`, `Programs`, `Categories`, `CourseDetail`) call `useSeo()` with non-empty `title`, `description`, `canonicalPath`, `ogType`, and `jsonLd` — constitution gate 2

**Checkpoint**: US1 fully functional — anonymous visitor can browse full catalog in AR/EN with SEO metadata; sitemap accessible at `/sitemap.xml`

---

## Phase 4: User Story 2 — Download the Training Schedule File (Priority: P2)

**Goal**: A visitor clicks the landing-page banner and downloads the current schedule file with no login required.

**Independent Test**: Open landing page → click banner → file downloads immediately. When no file exists, banner is hidden or shows unavailable message.

### Backend — US2

- [X] T059 [US2] Implement `upload.service.ts` in `backend/src/services/upload.service.ts` — Multer `diskStorage` config; accepts `application/pdf`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; max 10 MB; saves to `UPLOAD_DIR/schedule-files/` with timestamped filename
- [X] T060 [US2] Implement `GET /api/v1/schedule-file/download` endpoint in `backend/src/modules/admin/admin.controller.ts` + `admin.routes.ts` — queries latest `ScheduleFile` record by `createdAt DESC`; returns 302 redirect to `fileUrl`; returns 404 if no record exists; no auth required

### Frontend — US2

- [X] T061 [US2] Add schedule-file service method `getScheduleFileDownloadUrl()` in `frontend/src/shared/services/adminService.ts` — calls `GET /api/v1/schedule-file/download` and returns resolved URL (or null on 404)
- [X] T062 [US2] Create `ScheduleBanner.vue` in `frontend/src/modules/customer/components/ScheduleBanner.vue` — on mount checks if download URL exists; if yes shows banner image as `<a>` download link; if no shows nothing (or locale-keyed "Schedule coming soon" message)
- [X] T063 [US2] Integrate `ScheduleBanner.vue` into `CustomerHome.vue` — renders below the hero section

**Checkpoint**: US2 done — banner visible when file exists; download works for anonymous users

---

## Phase 5: User Story 3 — Customer Registration & Account Setup (Priority: P3)

**Goal**: Visitors can register, log in, and see their personal dashboard.

**Independent Test**: Register with valid fields → redirected to dashboard; log in with correct credentials → dashboard; wrong credentials → generic error; duplicate email → 409 error.

### Backend — US3

- [ ] T064 [P] [US3] Create auth Zod schemas in `backend/src/modules/auth/auth.schema.ts` — `registerSchema` (fullName min 2, companyName min 2, email, password min 8), `loginSchema`
- [ ] T065 [US3] Implement `auth.service.ts` in `backend/src/modules/auth/auth.service.ts` — `register()` (bcrypt 12 rounds, create User + RefreshToken, return accessToken + user), `login()` (compare hash, rotate token), `refresh()` (verify SHA-256 hash in DB, issue new token pair), `logout()` (revoke RefreshToken), `me()` (return user from DB)
- [ ] T066 [US3] Implement `auth.controller.ts` in `backend/src/modules/auth/auth.controller.ts` — handlers for `POST /register` (201), `POST /login` (200), `POST /refresh` (200), `POST /logout` (204), `GET /me` (200); set/clear `__rt` HttpOnly cookie on appropriate endpoints
- [ ] T067 [US3] Create `auth.routes.ts` in `backend/src/modules/auth/auth.routes.ts` — apply `rateLimiter` to register + login + refresh; register under `/api/v1/auth` in routes index

### Frontend — US3

- [ ] T068 [P] [US3] Add auth locale keys to `frontend/src/locales/ar.json` and `frontend/src/locales/en.json` — labels for full name, company name, email, password, "Register", "Login", "Logout", error messages, "Email already registered"
- [ ] T069 [P] [US3] Define `User`, `AuthResponse`, `RegisterPayload`, `LoginPayload` interfaces in `frontend/src/shared/types/auth.ts`
- [ ] T070 [P] [US3] Implement `authService.ts` in `frontend/src/shared/services/authService.ts` — typed `register()`, `login()`, `refresh()`, `logout()`, `me()` wrapping the Axios instance; `refresh` is called by the Axios interceptor in `api.ts`
- [ ] T071 [US3] Create `Register.vue` in `frontend/src/modules/customer/views/Register.vue` — VeeValidate + Zod resolver (`registerSchema` mirroring backend); fields: fullName, companyName, email, password; on success stores token in `useAuthStore`, navigates to `/dashboard`; shows 409 inline email-taken error
- [ ] T072 [US3] Create `Login.vue` in `frontend/src/modules/customer/views/Login.vue` — VeeValidate + Zod resolver (`loginSchema`); on success stores token + user in `useAuthStore`, navigates to `/dashboard`; 401 shows generic "Invalid credentials" message (no field hint)
- [ ] T073 [US3] Create `Dashboard.vue` in `frontend/src/modules/customer/views/Dashboard.vue` — displays user greeting (name, company); shows empty state for bookings ("No bookings yet" with CTA to browse courses); wired to `useBookingsStore` (populated in US4)
- [ ] T074 [US3] Update `frontend/src/modules/customer/routes.ts` to add `/register` and `/login` under `PublicLayout`; add `/dashboard` under `CustomerLayout` with navigation guard redirecting to `/login` if `useAuthStore.accessToken` is null

**Checkpoint**: US3 done — full registration + login + dashboard flow works independently; admin login at `/admin/login` also functional via AdminLogin.vue (see US5)

---

## Phase 6: User Story 4 — Purchase and Book a Course (Priority: P4)

**Goal**: A logged-in customer selects a schedule slot, pays, and gets a booking confirmation with reference number visible on their dashboard.

**Independent Test**: Logged-in user on CourseDetail clicks booking CTA → selects slot → checkout → webhook simulates payment → confirmation screen shows reference; dashboard shows booking history.

### Backend — US4

- [ ] T075 [P] [US4] Create purchases Zod schema in `backend/src/modules/purchases/purchases.schema.ts` — `createPurchaseSchema` (`scheduleId` cuid), webhook payload schema
- [ ] T076 [US4] Implement `purchases.service.ts` in `backend/src/modules/purchases/purchases.service.ts` — `createPurchase(userId, scheduleId)`: checks schedule active + `availableSeats > 0` + no existing CONFIRMED booking (returns 409 on conflict); creates Purchase PENDING; returns `{ purchaseId, amount, currency, status, paymentIntent }`
- [ ] T077 [US4] Implement purchase webhook handler in `purchases.service.ts` — on success event: set Purchase PAID, create Booking with `reference = BK-YYYYMMDD-NNNN` (auto-incremented counter), return `{ received: true }`; on failure: set Purchase FAILED
- [ ] T078 [US4] Implement `purchases.controller.ts` and `purchases.routes.ts` in `backend/src/modules/purchases/` — `POST /api/v1/purchases` (CUSTOMER auth), `POST /api/v1/purchases/webhook` (no auth, verify signature header); register in routes index
- [ ] T079 [P] [US4] Implement `bookings.service.ts` in `backend/src/modules/bookings/bookings.service.ts` — `listCustomerBookings(userId)` joins Schedule + Course; `getBookingByReference(ref, userId)` returns 403 if userId mismatch; `listAdminBookings(filters)` paginated
- [ ] T080 [US4] Implement `bookings.controller.ts` and `bookings.routes.ts` in `backend/src/modules/bookings/` — `GET /api/v1/bookings` (CUSTOMER), `GET /api/v1/bookings/:reference` (CUSTOMER own or ADMIN), `GET /api/v1/admin/bookings` (ADMIN), `DELETE /api/v1/admin/bookings/:id` (ADMIN → CANCELLED); register in routes index

### Frontend — US4

- [ ] T081 [P] [US4] Add booking flow locale keys to `frontend/src/locales/ar.json` and `frontend/src/locales/en.json` — "Select Date", "Fully Booked", "Available Seats", "Proceed to Checkout", "Booking Confirmed", "Booking Reference", "View Dashboard", "No Upcoming Dates"
- [ ] T082 [P] [US4] Define `Purchase`, `Booking`, `BookingStatus` interfaces in `frontend/src/shared/types/booking.ts`
- [ ] T083 [P] [US4] Implement `bookingsService.ts` in `frontend/src/shared/services/bookingsService.ts` — typed `createPurchase(scheduleId)`, `listBookings()`, `getBooking(reference)`
- [ ] T084 [US4] Implement `useBookingsStore` in `frontend/src/shared/stores/bookings.ts` (Composition API) — `bookings`, `fetchBookings()`, `activeBooking` (post-confirmation state)
- [ ] T085 [US4] Update `CourseDetail.vue` — replace static schedule list with interactive slot picker; for each slot show dates, location, `availableSeats`; fully-booked slots show "Fully Booked" badge (not selectable); "Book Now" CTA redirects to `/login` if unauthenticated (via router guard), else navigates to `/booking/:scheduleId`
- [ ] T086 [US4] Create `Booking.vue` in `frontend/src/modules/customer/views/Booking.vue` — under `CustomerLayout`; shows selected schedule summary + price; on submit calls `bookingsService.createPurchase()`; displays returned `paymentIntent` placeholder (or simulated webhook flow in dev); on booking confirmed shows confirmation panel with `reference` number and "View Dashboard" link
- [ ] T087 [US4] Update `Dashboard.vue` to call `useBookingsStore.fetchBookings()` on mount; render booking history table with columns: Reference, Course (locale-aware), Start Date, Status; empty state if no bookings
- [ ] T088 [US4] Add `/booking/:scheduleId` route to `frontend/src/modules/customer/routes.ts` under `CustomerLayout` with auth guard

**Checkpoint**: US4 done — full booking loop from course detail through payment to confirmation and dashboard display

---

## Phase 7: User Story 5 — Admin Manages Content (Priority: P5)

**Goal**: An admin can log in and perform full CRUD on Programs, Categories, Courses, and Schedules; changes appear immediately in the customer catalog.

**Independent Test**: Admin logs in → creates Program + Category + Course + Schedule → verifies course appears in customer catalog; deletes a Program → catalog no longer shows it.

### Backend — US5

- [ ] T089 [P] [US5] Add write Zod schemas to `backend/src/modules/programs/programs.schema.ts` — already covers create; add update variant; add slug-change detection logic in service
- [ ] T090 [US5] Add `createProgram`, `updateProgram`, `deleteProgram` to `programs.service.ts` — `updateProgram` inserts `SlugRedirect` when slug changes; all writes call `cacheService.invalidatePrefix('cache:list:programs')`, `cacheService.del('cache:entity:program:<slug>')`, and `cacheService.del('cache:sitemap')`
- [ ] T091 [US5] Add `POST /api/v1/programs`, `PUT /api/v1/programs/:id`, `DELETE /api/v1/programs/:id` handlers to `programs.controller.ts` and `programs.routes.ts` — require `ADMIN` role via `requireRole`
- [ ] T092 [P] [US5] Add write Zod schemas to `backend/src/modules/categories/categories.schema.ts` — `createCategorySchema`, `updateCategorySchema`
- [ ] T093 [US5] Add `createCategory`, `updateCategory`, `deleteCategory` to `categories.service.ts` — `deleteCategory` returns 409 warning payload if category has confirmed bookings in its courses (unless `confirm=true` query param); cache invalidation on all writes
- [ ] T094 [US5] Add `POST`, `PUT`, `DELETE` handlers for categories to `categories.controller.ts` and `categories.routes.ts` — require `ADMIN` role
- [ ] T095 [P] [US5] Add write Zod schemas to `backend/src/modules/courses/courses.schema.ts` — `createCourseSchema`, `updateCourseSchema` — categoryId, all bilingual fields, price, durationHours, seoTitle ≤ 60, seoDesc ≤ 160, slug regex
- [ ] T096 [US5] Add `createCourse`, `updateCourse`, `deleteCourse` to `courses.service.ts` — `deleteCourse` returns 409 warning if active bookings + `confirm` not provided; `updateCourse` creates `SlugRedirect` on slug change; cache invalidation
- [ ] T097 [US5] Add `POST /api/v1/admin/courses`, `PUT /api/v1/admin/courses/:id`, `DELETE /api/v1/admin/courses/:id` to `courses.controller.ts` and `courses.routes.ts` — require `ADMIN` role; register in routes index
- [ ] T098 [P] [US5] Create schedules Zod schema in `backend/src/modules/schedules/schedules.schema.ts` — `createScheduleSchema` (courseId, startDate, endDate with `endDate > startDate` refinement, location optional, maxCapacity positive int)
- [ ] T099 [US5] Implement `schedules.service.ts` in `backend/src/modules/schedules/schedules.service.ts` — `createSchedule`, `updateSchedule` (422 if new maxCapacity < confirmedBookings), `deleteSchedule` (409 warning if confirmed bookings + confirm not provided), `listAdminSchedules(filters)`; invalidate `cache:entity:course:<slug>` on every write
- [ ] T100 [US5] Implement `schedules.controller.ts` and `schedules.routes.ts` in `backend/src/modules/schedules/` — `POST`, `PUT`, `DELETE`, `GET /api/v1/admin/schedules`; require `ADMIN` role; register in routes index

### Frontend — US5

- [ ] T101 [P] [US5] Add admin content locale keys to `frontend/src/locales/ar.json` and `frontend/src/locales/en.json` — "Create Program", "Edit Program", "Delete", "Confirm Delete", "Active Bookings Warning", "Save", "Cancel", bilingual field labels
- [ ] T102 [P] [US5] Define admin CRUD request/response types in `frontend/src/shared/types/admin.ts` — `CreateProgramPayload`, `UpdateProgramPayload`, `CreateCategoryPayload`, `CreateCoursePayload`, `CreateSchedulePayload`
- [ ] T103 [P] [US5] Implement content CRUD methods in `frontend/src/shared/services/adminService.ts` — `createProgram`, `updateProgram`, `deleteProgram`, `createCategory`, `updateCategory`, `deleteCategory`, `createCourse`, `updateCourse`, `deleteCourse`, `createSchedule`, `updateSchedule`, `deleteSchedule`, `listAdminSchedules`
- [ ] T104 [US5] Create admin module route definitions in `frontend/src/modules/admin/routes.ts` — all routes under `AdminLayout` with `ADMIN`/`SUPER_ADMIN` navigation guard; includes `/admin/login`, `/admin/programs`, `/admin/programs/:id/edit`, `/admin/categories/:id/edit`, `/admin/courses`, `/admin/courses/:id/edit`, `/admin/schedules`, `/admin/schedule-file`
- [ ] T105 [US5] Create `AdminLogin.vue` in `frontend/src/modules/admin/views/AdminLogin.vue` — VeeValidate + Zod `loginSchema`; on success stores token in `useAuthStore`, redirects to `/admin/programs`; disallow access if already admin-authed
- [ ] T106 [US5] Create `AdminPrograms.vue` in `frontend/src/modules/admin/views/AdminPrograms.vue` — table listing all programs (AR name, EN name, slug, category count); "New Program" button; delete with confirmation modal showing cascade warning; links to edit route
- [ ] T107 [US5] Create `ProgramEdit.vue` in `frontend/src/modules/admin/views/ProgramEdit.vue` — create/edit form; bilingual fields (nameAr, nameEn, descriptionAr, descriptionEn) all required; VeeValidate + Zod; `SeoPanel` embedded (added in US6); on save calls `adminService.createProgram` or `updateProgram`; redirects to list
- [ ] T108 [US5] Create `AdminCategories.vue` and `CategoryEdit.vue` in `frontend/src/modules/admin/views/` — list scoped to a program; create/edit form with bilingual name + description; delete with confirmation warning if courses have bookings
- [ ] T109 [US5] Create `AdminCourses.vue` and `CourseEdit.vue` in `frontend/src/modules/admin/views/` — list all courses (EN name, program, price, schedule count); create/edit form with bilingual fields + price + durationHours + currency; delete with booking warning modal; `SeoPanel` embedded (US6)
- [ ] T110 [US5] Create `AdminSchedules.vue` in `frontend/src/modules/admin/views/AdminSchedules.vue` — lists all schedules with course name, dates, capacity, confirmed bookings, available seats; inline add/edit via modal (`createScheduleSchema`); delete with booking count warning

**Checkpoint**: US5 done — admin can manage full content hierarchy; cache invalidated on every write so customer portal reflects changes immediately

---

## Phase 8: User Story 6 — Admin Manages SEO Metadata (Priority: P6)

**Goal**: Admin sees live SERP preview while editing SEO fields; real-time character counters enforce ≤ 60 / ≤ 160 limits; slug uniqueness validated with debounce.

**Independent Test**: Open CourseEdit → type in SEO title field > 60 chars → counter goes red; change slug → uniqueness check fires (debounced); save allowed only when slug is unique.

### Backend — US6

- [ ] T111 [US6] Implement `GET /api/v1/admin/slugs/check` handler in `backend/src/modules/admin/admin.controller.ts` — query params: `slug` (required), `type: "program" | "course"` (required), `excludeId` (optional); checks uniqueness in `Program` or `Course` table excluding `excludeId`; returns `{ available: boolean }`
- [ ] T112 [US6] Register slug-check route in `backend/src/modules/admin/admin.routes.ts` with `ADMIN` role guard; register admin module router in `backend/src/routes/index.ts`

### Frontend — US6

- [ ] T113 [P] [US6] Implement `useSlugField.ts` composable in `frontend/src/shared/composables/useSlugField.ts` — accepts `{ slug, type, excludeId }`; debounces 400 ms; calls `GET /api/v1/admin/slugs/check`; returns `{ isChecking, isAvailable, errorMessage }`; auto-generates slug from EN name input on create
- [ ] T114 [P] [US6] Create `SerpPreview.vue` in `frontend/src/modules/admin/components/SerpPreview.vue` — renders a mock Google SERP card showing title (truncated at 60), URL with slug, description (truncated at 160); accepts props `{ title, url, description }` and updates reactively as parent types
- [ ] T115 [P] [US6] Create `SlugField.vue` in `frontend/src/modules/admin/components/SlugField.vue` — input bound to `useSlugField` composable; shows spinner during check; green "Available" or red "Taken" inline badge; disables parent save button via emitted validity state
- [ ] T116 [P] [US6] Create `SeoPanel.vue` in `frontend/src/modules/admin/components/SeoPanel.vue` — tab or collapsible section with: seoTitleAr + counter (red at > 60), seoTitleEn + counter, seoDescAr + counter (red at > 160), seoDescEn + counter, `SlugField`, `SerpPreview` that updates live; validates with Zod on parent form submit
- [ ] T117 [US6] Embed `SeoPanel.vue` into `ProgramEdit.vue` and `CourseEdit.vue` — wire `excludeId` to current entity id; wire slug to URL preview; save button remains disabled until slug is valid

**Checkpoint**: US6 done — SEO workflow fully functional with live preview and inline validation

---

## Phase 9: User Story 7 — Admin Uploads the Schedule File (Priority: P7)

**Goal**: Admin uploads a PDF/XLS/XLSX file in the Admin Portal; the landing-page banner immediately serves the new file.

**Independent Test**: Admin uploads a valid file → success toast with upload date; visit landing page → download serves new file. Uploading invalid type → error message listing accepted formats.

### Backend — US7

- [ ] T118 [US7] Implement `POST /api/v1/admin/schedule-file` handler in `backend/src/modules/admin/admin.controller.ts` — applies Multer middleware from `upload.service.ts`; on success creates `ScheduleFile` DB record; returns 201 with `{ id, filename, originalName, fileUrl, createdAt }`; returns 415 for wrong MIME, 413 for > 10 MB, 400 if no file
- [ ] T119 [US7] Implement `GET /api/v1/admin/schedule-file` handler — queries latest `ScheduleFile` by `createdAt DESC`; returns 200 with metadata or 404; register both routes in `admin.routes.ts`

### Frontend — US7

- [ ] T120 [P] [US7] Add schedule upload locale keys to `frontend/src/locales/ar.json` and `frontend/src/locales/en.json` — "Upload Schedule File", "Current File", "Upload Date", "No file uploaded yet", "Unsupported file type", file format hints
- [ ] T121 [P] [US7] Add `uploadScheduleFile(file: File)` and `getAdminScheduleFile()` methods to `frontend/src/shared/services/adminService.ts` — `uploadScheduleFile` posts `multipart/form-data`
- [ ] T122 [US7] Create `AdminScheduleFile.vue` in `frontend/src/modules/admin/views/AdminScheduleFile.vue` — displays current file info (name, upload date) fetched from `getAdminScheduleFile()`; file input (accept `.pdf,.xls,.xlsx`) validated with VeeValidate (`max 10 MB`, type check); on submit calls `uploadScheduleFile`; shows success toast with new upload date or inline error for 415/413

**Checkpoint**: US7 done — admin upload and customer download are fully connected end-to-end

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, constitution gate checks, and cross-cutting quality items.

- [ ] T123 [P] Audit all admin write endpoints (POST/PUT/PATCH/DELETE) across all backend modules — confirm every handler calls `cacheService.invalidatePrefix` or `cacheService.del` for affected cache keys (constitution gate 4)
- [ ] T124 [P] Audit all public frontend views — confirm every view calls `useSeo()` with non-empty `title`, `description`, `canonicalPath`, `ogType`, and `jsonLd` (constitution gate 2)
- [ ] T125 [P] Run `cd frontend && pnpm tsc --noEmit` and resolve all TypeScript errors (constitution gate 1)
- [ ] T126 [P] Run `cd backend && pnpm tsc --noEmit` and resolve all TypeScript errors (constitution gate 1)
- [ ] T127 Run `cd frontend && pnpm build` and inspect chunk sizes — confirm no chunk exceeds 250 KB gzipped; adjust `manualChunks` in `vite.config.ts` if needed (constitution gate 5)
- [ ] T128 [P] Verify `SlugRedirect` 301 logic is active for both programs (`programs.service.ts`) and courses (`courses.service.ts`) — test by renaming a slug in admin and hitting the old URL
- [ ] T129 [P] Verify Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`) are emitted by `useSeo.ts` on all public pages — inspect HTML head in browser devtools
- [ ] T130 [P] Run `cd backend && pnpm prisma db seed` and validate all quickstart.md verification steps — API health, programs list, sitemap XML, robots.txt, landing page, admin login

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **User Stories (Phase 3–9)**: All depend on Phase 2 completion
  - Stories can proceed in priority order (P1 → P2 → … → P7)
  - Or in parallel if team capacity allows (see Parallel Strategy below)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Notes |
|---|---|---|
| US1 (P1) | Phase 2 | Fully independent — MVP entry point |
| US2 (P2) | Phase 2 | Backend download endpoint standalone; full end-to-end needs US7 for upload |
| US3 (P3) | Phase 2 | Independent — no catalog dependency |
| US4 (P4) | US1 + US3 | Booking flow requires catalog routes and auth to be done |
| US5 (P5) | Phase 2 | Admin CRUD is independent of customer stories |
| US6 (P6) | US5 | SEO panel is embedded in admin edit forms |
| US7 (P7) | Phase 2 | Upload endpoint independent; completes US2 end-to-end |

### Within Each User Story

- Backend service → controller → routes → register in index
- Frontend types → service → store → views → route definition
- All forms: VeeValidate + Zod before any view is "done"
- All public views: `useSeo()` call before marking story complete

### Parallel Opportunities

- All [P] tasks within a phase share no file dependencies and can run simultaneously
- Once Phase 2 completes, US1, US2, US3, US5 can all start in parallel
- US4 can start as soon as US1 and US3 are complete
- US6 can start as soon as US5 admin forms exist (ProgramEdit, CourseEdit)
- US7 backend can start any time after Phase 2; US7 frontend can start after US5 admin nav exists

---

## Parallel Example: Phase 2 Backend

```
# All of these can run simultaneously (different files):
T015 — backend/src/middleware/auth.ts
T016 — backend/src/middleware/requireRole.ts
T017 — backend/src/middleware/validate.ts
T018 — backend/src/middleware/rateLimiter.ts
```

## Parallel Example: User Story 1 Backend

```
# Service files can be authored in parallel:
T035 — programs.service.ts
T039 — categories.service.ts
T042 — courses.service.ts

# Then controllers depend on services (sequential):
T036 → T037  (programs controller + routes)
T040         (categories controller + routes)
T043         (courses controller + routes)
T044 → T045  (sitemap service + route)
```

## Parallel Example: User Story 1 Frontend

```
# All of these touch different files — run in parallel:
T046 — locales/ar.json + en.json
T047 — shared/types/catalog.ts
T048 — services/programsService.ts
T049 — services/coursesService.ts
T050 — stores/programs.ts
T051 — stores/courses.ts

# Then views depend on the above (sequential):
T052 → T053 → T054 → T055 → T056 → T057 → T058
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — CRITICAL
3. Complete Phase 3: User Story 1 (catalog browse + SEO)
4. **STOP and VALIDATE**: Anonymous visitor can browse full catalog in AR + EN; sitemap returns valid XML
5. Deploy/demo if ready — platform is immediately valuable as a digital catalog

### Incremental Delivery

| Sprint | Stories | Deliverable |
|---|---|---|
| 1 | Phase 1 + 2 | Dev environment fully runnable |
| 2 | US1 | Public catalog + SEO + sitemap — go-live candidate |
| 3 | US2 + US3 | Schedule download + customer auth |
| 4 | US5 + US6 | Admin content + SEO management |
| 5 | US4 | Purchase + booking flow |
| 6 | US7 + Polish | Schedule upload + hardening |

### Parallel Team Strategy

With three developers after Phase 2:

- **Dev A**: US1 (catalog) → US4 (booking flow)
- **Dev B**: US3 (auth) → US4 (booking flow, join Dev A)
- **Dev C**: US5 (admin CRUD) → US6 (SEO panel) → US7 (file upload)

---

## Notes

- `[P]` tasks touch different files — no blocking dependency within the same phase
- `[US#]` label maps each task to a specific user story for traceability
- Constitution gates must be verified before any story is marked complete: TypeScript, `useSeo()`, VeeValidate+Zod, Redis invalidation, bundle size
- Tailwind: use `ms-`/`me-`/`ps-`/`pe-` only — never `ml-`/`mr-`/`pl-`/`pr-`
- JWT: store access token in Pinia memory only — never `localStorage` or `sessionStorage`
- All new admin write endpoints must invalidate the relevant Redis cache keys immediately after the DB write
- Public URLs: slug-based only — no numeric IDs anywhere in Vue Router path params served to customers
