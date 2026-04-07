````markdown
# MA Training Platform — Product Requirements Document

---

## Section 1 — Project Identity

| Field             | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| Project Name      | MA Training Platform                                            |
| Project ID        | PRD-001                                                         |
| Version           | v1.2                                                            |
| Status            | Draft                                                           |
| Priority          | High                                                            |
| Created Date      | 2026-04-06                                                      |
| Last Updated      | 2026-04-07                                                      |
| Owner / PM        | Aziza                                                           |
| Team Members      | Frontend Dev / Backend Dev / Designer / QA                      |
| Frontend Stack    | Vue 3 + Vite + TypeScript + Tailwind CSS + Pinia + Vue Router 4 |
| Backend Stack     | Node.js + Express + TypeScript + Prisma ORM                     |
| Database          | PostgreSQL + Redis                                              |
| SEO Stack         | @vueuse/head + Vue Router SSR-ready meta + Sitemap + robots.txt |
| Repository        | [TBD]                                                           |
| Git Branch Prefix | NNN-feature-name                                                |
| PRD File Path     | docs/PRD.md                                                     |

---

## Section 2 — Problem & Purpose

### Problem Statement

Companies currently discover and book corporate training programs through manual channels —
phone calls, emails, and PDF catalogs. This process is slow, error-prone, and impossible to
scale. Additionally, without SEO optimization, the platform cannot be discovered organically
by companies searching for training solutions online.

### Project Purpose

MA Training Platform is a modern, full-stack dual-portal web application with built-in SEO
support. It digitizes the full corporate training lifecycle — from organic discovery through
search engines, to purchase and booking — giving companies a professional self-service
experience and giving administrators complete control over all platform content and metadata.

### Business Value

- Enables organic search discovery of training programs and courses via Google and Bing
- Increases course bookings by removing friction in the discovery and purchase process
- Reduces administrative overhead through a fully managed admin content portal
- Improves brand authority through proper structured data (Schema.org) and meta tags
- Supports Arabic and English SEO — bilingual search engine visibility

### Opportunity

Corporate HR and training managers search online for training solutions before contacting
providers. A platform with strong SEO captures this demand at the discovery stage before
competitors who rely on manual outreach only.

---

## Section 3 — Goals & Objectives

### Primary Goal

Deliver a fully functional, SEO-optimized training platform where companies can discover,
browse, purchase, and schedule courses — with a complete admin portal for content and
SEO metadata management.

### Objectives

1. Build a professional bilingual (AR/EN) landing page with RTL support and schedule file download
2. Implement secure JWT-based authentication with role-based access for Customer and Admin portals
3. Deliver a browsable Training Program → Category → Course hierarchy with full detail pages
4. Enable course purchase intent recording and time-slot booking flows for company users
5. Build a complete Admin CRUD portal for Programs, Categories, Courses, Schedules, and File Upload
6. Deliver a production-ready Node.js REST API with PostgreSQL, Prisma ORM, and Redis caching
7. Implement full SEO support: dynamic meta tags, Open Graph, Twitter Cards, structured data,
   sitemap.xml, robots.txt, canonical URLs, and bilingual SEO for Arabic and English

### Success Definition

- A company user can register, browse, purchase, and book a course end-to-end without assistance
- An admin can manage all content and configure SEO metadata per page/course
- Course and program pages are indexable by search engines with correct meta and structured data
- Platform appears in search results for relevant Arabic and English training keywords
- All P0 features pass QA acceptance criteria

### Non-Goals

- This PRD does not cover native mobile applications
- This PRD does not cover real payment gateway processing
- This PRD does not cover video streaming or LMS features
- This PRD does not cover paid search (Google Ads) campaign management

---

## Section 4 — Scope

### In Scope

- Professional bilingual landing page with hero section and schedule file download
- User authentication: registration, login, JWT + refresh token, role-based route guards
- Dual portal architecture: Customer Portal and Admin Portal with separate Vue layouts
- Training hierarchy: Training Programs → Categories → Courses
- Course detail pages with purchase flow and time-slot booking
- Admin full CRUD for Programs, Categories, Courses, and Schedules
- Admin schedule file upload (PDF/Excel)
- Multi-language: Arabic and English with RTL/LTR switching (vue-i18n v9)
- Global state management with Pinia
- Axios HTTP interceptor for JWT attachment and refresh token rotation
- Node.js + Express REST API with TypeScript + Prisma + PostgreSQL + Redis
- **SEO: Dynamic per-page meta tags (title, description, keywords)**
- **SEO: Open Graph tags for social sharing (Facebook, LinkedIn)**
- **SEO: Twitter Card tags**
- **SEO: Schema.org structured data (Course, Organization, BreadcrumbList)**
- **SEO: Canonical URL management per page**
- **SEO: Auto-generated sitemap.xml served from Node.js backend**
- **SEO: robots.txt with crawl rules**
- **SEO: Bilingual SEO — hreflang tags for AR and EN**
- **SEO: Admin interface to manage SEO metadata per Program and Course**
- **SEO: SSR-ready meta via @vueuse/head (vue-meta alternative)**
- **SEO: Semantic HTML structure across all public pages**
- **SEO: Structured URL slugs for programs and courses**
- **SEO: Page speed optimization aligned with Core Web Vitals**

### Out of Scope

- Native iOS or Android mobile application
- Real payment gateway or financial transaction processing
- Live video streaming or embedded course content player
- Learner progress tracking or completion certificates
- Analytics dashboards (SEO analytics via Google Search Console — external)
- Paid search campaign management
- AI-powered course recommendations

### Assumptions

- Public-facing pages (landing, programs, categories, courses) are crawlable by search engines
- Admin portal and authenticated customer pages are excluded from crawling via robots.txt
- Arabic SEO targets Saudi Arabia, UAE, and GCC markets
- English SEO targets international corporate clients
- Google Search Console will be configured post-launch by the PM

### Constraints

- Frontend: Vue 3 + Vite + TypeScript + Tailwind CSS only
- SEO meta management: @vueuse/head only (no SSR framework required for v1)
- Sitemap generated server-side from Node.js
- Slug-based URLs mandatory for all public content pages
- No jQuery or legacy frontend libraries permitted

### Dependencies

- PostgreSQL database with slug fields on Program, Category, Course tables
- Design assets and brand guidelines from stakeholder
- Google Search Console account setup (post-launch)
- Sitemap submission to Google and Bing (post-launch)

---

## Section 5 — Users & Personas

### Primary Users

Corporate HR Managers and Training Coordinators who discover the platform via organic search,
browse training programs, and book courses for their employees.

### Secondary Users

Platform Administrators who manage all training content, schedules, downloadable assets,
and SEO metadata.

---

### Persona 1 — Primary User

| Field      | Detail                                                                              |
| ---------- | ----------------------------------------------------------------------------------- |
| Name       | Hana Al-Rashidi                                                                     |
| Role       | HR Training Coordinator                                                             |
| Goal       | Find and book the right training program for her team via Google search or referral |
| Pain Point | Cannot find training providers easily online; must rely on personal networks        |
| Tech Level | Medium                                                                              |
| Frequency  | Weekly                                                                              |
| Success    | Discovers the platform via search, registers, and books a course within 10 minutes  |

---

### Persona 2 — Secondary User

| Field      | Detail                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Name       | Platform Admin                                                                     |
| Role       | Training Operations Administrator                                                  |
| Goal       | Manage all platform content and SEO metadata from a single secure admin portal     |
| Pain Point | No centralized tool to manage content and ensure pages rank well in search engines |
| Tech Level | Medium                                                                             |
| Frequency  | Daily                                                                              |
| Success    | Updates course SEO title and description in under 2 minutes; sitemap auto-updates  |

---

## Section 6 — MoSCoW Feature Prioritization

### Must Have — P0

| ID      | Feature                         | Status | Description                                                                   | Assigned To  | Sprint |
| ------- | ------------------------------- | ------ | ----------------------------------------------------------------------------- | ------------ | ------ |
| P0-F001 | User Registration               | TODO   | Company users register with email, password, and company details              | Frontend Dev | 1      |
| P0-F002 | User Login                      | TODO   | Secure JWT login; role claim routes user to correct portal                    | Frontend Dev | 1      |
| P0-F003 | Role-Based Route Guards         | TODO   | Admin and Customer routes protected by Vue Router beforeEach guards           | Frontend Dev | 1      |
| P0-F004 | Landing Page with Hero Section  | TODO   | Public landing page with navbar, hero banner, language toggle                 | Frontend Dev | 1      |
| P0-F005 | Schedule File Download          | TODO   | Banner click triggers download of admin-uploaded schedule PDF/Excel           | Frontend Dev | 1      |
| P0-F006 | Training Programs Listing       | TODO   | Browse all active training programs with name, image, description             | Frontend Dev | 2      |
| P0-F007 | Category Listing per Program    | TODO   | Browse categories within a selected training program                          | Frontend Dev | 2      |
| P0-F008 | Course Listing per Category     | TODO   | Browse courses within a selected category                                     | Frontend Dev | 2      |
| P0-F009 | Course Detail Page              | TODO   | Full course page: title, description, duration, price, schedules              | Frontend Dev | 2      |
| P0-F010 | Course Purchase Flow            | TODO   | Company initiates purchase; system records purchase intent via API            | Frontend Dev | 2      |
| P0-F011 | Course Booking / Scheduling     | TODO   | User selects available time slot and books the course                         | Frontend Dev | 2      |
| P0-F012 | Admin: Programs CRUD            | TODO   | Admin creates, edits, deletes training programs                               | Frontend Dev | 3      |
| P0-F013 | Admin: Categories CRUD          | TODO   | Admin creates, edits, deletes categories under programs                       | Frontend Dev | 3      |
| P0-F014 | Admin: Courses CRUD             | TODO   | Admin creates, edits, deletes courses with bilingual fields                   | Frontend Dev | 3      |
| P0-F015 | Admin: Schedule Management      | TODO   | Admin creates and manages time slots per course                               | Frontend Dev | 3      |
| P0-F016 | Admin: Schedule File Upload     | TODO   | Admin uploads PDF/Excel schedule file served to customers                     | Frontend Dev | 3      |
| P0-F017 | Dual Portal Layout Separation   | TODO   | Separate CustomerLayout and AdminLayout with lazy-loaded modules              | Frontend Dev | 1      |
| P0-F018 | i18n Arabic / English + RTL     | TODO   | Full bilingual support; RTL switches instantly for Arabic                     | Frontend Dev | 1      |
| P0-F019 | HTTP Interceptor                | TODO   | Attaches JWT to all requests; handles 401 refresh token rotation              | Frontend Dev | 1      |
| P0-F020 | Pinia State Management          | TODO   | Global stores for auth, programs, courses, bookings, language                 | Frontend Dev | 1      |
| P0-F021 | Node.js Auth API                | TODO   | POST /register, /login, /refresh, /logout with JWT                            | Backend Dev  | 1      |
| P0-F022 | Node.js Content API             | TODO   | Programs, Categories, Courses, Schedules CRUD endpoints                       | Backend Dev  | 2      |
| P0-F023 | Node.js Purchase & Booking API  | TODO   | POST /purchases and POST /bookings with validation                            | Backend Dev  | 2      |
| P0-F024 | Node.js File Management API     | TODO   | POST /admin/schedule-file; GET /schedule/download                             | Backend Dev  | 3      |
| P0-F025 | Prisma + PostgreSQL Schema      | TODO   | Full database schema with slug fields on Program, Category, Course            | Backend Dev  | 1      |
| P0-F026 | Redis Caching Layer             | TODO   | Cache program/course listings; invalidate on admin CRUD                       | Backend Dev  | 2      |
| P0-F027 | SEO: Dynamic Meta Tags          | TODO   | Per-page title, description, keywords via @vueuse/head                        | Frontend Dev | 2      |
| P0-F028 | SEO: Open Graph + Twitter Cards | TODO   | OG and Twitter meta tags on all public pages                                  | Frontend Dev | 2      |
| P0-F029 | SEO: Schema.org Structured Data | TODO   | Course, Organization, BreadcrumbList JSON-LD on relevant pages                | Frontend Dev | 2      |
| P0-F030 | SEO: Canonical URLs             | TODO   | Canonical link tag on every public page                                       | Frontend Dev | 2      |
| P0-F031 | SEO: hreflang Tags              | TODO   | hreflang="ar" and hreflang="en" on all bilingual public pages                 | Frontend Dev | 2      |
| P0-F032 | SEO: Slug-Based URLs            | TODO   | /programs/:slug, /courses/:slug replacing UUID-based routes                   | Frontend Dev | 2      |
| P0-F033 | SEO: sitemap.xml                | TODO   | Auto-generated sitemap from Node.js served at /sitemap.xml                    | Backend Dev  | 3      |
| P0-F034 | SEO: robots.txt                 | TODO   | robots.txt blocking admin/auth routes; allowing public pages                  | Backend Dev  | 3      |
| P0-F035 | SEO: Admin Meta Management      | TODO   | Admin edits SEO title, description, and keywords per Program and Course       | Frontend Dev | 3      |
| P0-F036 | SEO: Semantic HTML              | TODO   | Proper H1–H3 hierarchy, alt text on images, landmark elements on public pages | Frontend Dev | 2      |

---

### Should Have — P1

| ID      | Feature                     | Status | Description                                                           | Assigned To  | Sprint |
| ------- | --------------------------- | ------ | --------------------------------------------------------------------- | ------------ | ------ |
| P1-F001 | Course Search & Filter      | TODO   | Search by name; filter by program, category, date, or language        | Frontend Dev | 4      |
| P1-F002 | Company Booking History     | TODO   | Customer views all past and upcoming course bookings                  | Frontend Dev | 4      |
| P1-F003 | Email Notifications         | TODO   | Booking confirmation email via Nodemailer                             | Backend Dev  | 4      |
| P1-F004 | Admin Dashboard Overview    | TODO   | Admin sees summary stats: programs, courses, bookings, companies      | Frontend Dev | 4      |
| P1-F005 | Responsive Web Design       | TODO   | Fully usable layout on tablet and mobile browsers                     | Frontend Dev | 4      |
| P1-F006 | SEO: XML Sitemap Index      | TODO   | Separate sitemap index for programs, courses, and static pages        | Backend Dev  | 4      |
| P1-F007 | SEO: Breadcrumb Schema      | TODO   | BreadcrumbList JSON-LD on category and course pages for rich results  | Frontend Dev | 4      |
| P1-F008 | SEO: Image Alt Optimization | TODO   | All course and program images have descriptive, keyword-rich alt text | Frontend Dev | 4      |
| P1-F009 | SEO: Page Speed Audit       | TODO   | Lighthouse CI enforces LCP < 2.5s, CLS < 0.1, FID < 100ms             | Frontend Dev | 4      |

---

### Could Have — P2

| ID      | Feature                    | Status | Description                                                     | Assigned To  | Sprint |
| ------- | -------------------------- | ------ | --------------------------------------------------------------- | ------------ | ------ |
| P2-F001 | Dark Mode                  | TODO   | Optional dark theme toggle for both portals                     | Frontend Dev | 5      |
| P2-F002 | Keyboard Shortcuts         | TODO   | Admin shortcuts for common CRUD actions                         | Frontend Dev | 5      |
| P2-F003 | Bulk Course Actions        | TODO   | Admin selects multiple courses to publish or delete             | Frontend Dev | 5      |
| P2-F004 | SEO: FAQ Schema            | TODO   | FAQPage JSON-LD on landing page for rich results in Google      | Frontend Dev | 5      |
| P2-F005 | SEO: Google Search Console | TODO   | GSC integration script + sitemap submission                     | Frontend Dev | 5      |
| P2-F006 | SEO: Social Share Preview  | TODO   | Admin previews how a page looks when shared on LinkedIn/Twitter | Frontend Dev | 5      |

---

### Won't Have — P3

| ID      | Feature                   | Status  | Description                                        | Assigned To | Sprint |
| ------- | ------------------------- | ------- | -------------------------------------------------- | ----------- | ------ |
| P3-F001 | Native Mobile App         | SKIPPED | iOS/Android app deferred to v2                     | —           | —      |
| P3-F002 | Real Payment Gateway      | SKIPPED | Live transactions deferred; v1 records intent only | —           | —      |
| P3-F003 | Video Streaming / LMS     | SKIPPED | Course content player deferred to v2               | —           | —      |
| P3-F004 | Learner Progress Tracking | SKIPPED | Completion tracking deferred to v2                 | —           | —      |
| P3-F005 | AI Recommendations        | SKIPPED | Personalization engine deferred to v2              | —           | —      |
| P3-F006 | Certificates & Badges     | SKIPPED | Credentialing system deferred to v2                | —           | —      |
| P3-F007 | Paid Search Management    | SKIPPED | Google Ads campaign management out of scope        | —           | —      |

---

## Section 7 — Functional Requirements

---

### P0-F027 — SEO: Dynamic Meta Tags

**Description:**
Every public-facing page has unique, crawlable title and description meta tags injected into
the document head using @vueuse/head. Meta content is populated from API data for dynamic
pages (programs, courses) and from static config for fixed pages (landing, 404).

**User Story:**
As a search engine crawler, I need to read a unique and descriptive title and meta description
on every page so that the platform appears correctly in search results.

**Trigger:** User or crawler navigates to any public page.

**Pre-conditions:**

- @vueuse/head installed and configured globally in main.ts
- API returns seoTitle, seoDescription, seoKeywords fields per Program and Course

**Post-conditions:**

- Document head contains correct title, description, and keywords for the active page
- Tags update dynamically on client-side navigation without page reload

**Main Flow:**

1. Vue Router resolves the route
2. Page component calls `useHead()` from @vueuse/head in `onMounted` or directly in setup
3. For static pages: values loaded from i18n locale config
4. For dynamic pages: values loaded from API response (`program.seoTitle`, `course.seoTitle`)
5. @vueuse/head injects/updates `<title>`, `<meta name="description">`, `<meta name="keywords">` in document head
6. On route change: previous tags replaced with new page's tags automatically

**Meta Tag Structure per Page:**

| Page             | Title Pattern                             | Description Pattern                                                   |
| ---------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Landing          | MA Training Platform — Corporate Training | Browse and book certified corporate training programs in Saudi Arabia |
| Programs Listing | Training Programs — MA Training Platform  | Explore all available training programs across multiple categories    |
| Program Detail   | {program.nameEn} — MA Training Platform   | {program.seoDescription}                                              |
| Course Detail    | {course.titleEn} — MA Training Platform   | {course.seoDescription}                                               |
| Login            | Login — MA Training Platform              | noindex                                                               |
| Register         | Register — MA Training Platform           | noindex                                                               |

**Alternate Flows:**

- API returns no seoTitle → fallback to program.nameEn or course.titleEn + " — MA Training Platform"
- Page not found → 404 page with noindex meta tag

**Acceptance Criteria:**

- [ ] Every public page has a unique `<title>` tag
- [ ] Every public page has a unique `<meta name="description">` tag under 160 characters
- [ ] Title tags update on client-side navigation without page refresh
- [ ] Login, Register, and all admin pages have `<meta name="robots" content="noindex, nofollow">`
- [ ] Fallback title applied when seoTitle is not set by admin
- [ ] All titles follow pattern: `{Page Name} — MA Training Platform`

---

### P0-F028 — SEO: Open Graph + Twitter Cards

**Description:**
All public pages include Open Graph and Twitter Card meta tags so that when links are shared
on LinkedIn, Twitter, WhatsApp, or Facebook, a rich preview is shown with image, title,
and description.

**User Story:**
As an HR coordinator, when I share a course link with my manager on LinkedIn, I want a
professional preview card to appear so it looks credible and drives clicks.

**Trigger:** Public page is loaded by a browser or social media crawler.

**Pre-conditions:**

- Course and program records have an imageUrl field
- Default fallback OG image exists at `/og-default.png` (1200×630px)

**Post-conditions:**

- Page head contains complete OG and Twitter Card meta tags

**Open Graph Tags (per page):**

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="{seoTitle}" />
<meta property="og:description" content="{seoDescription}" />
<meta property="og:image" content="{imageUrl | og-default.png}" />
<meta property="og:url" content="{canonical URL}" />
<meta property="og:site_name" content="MA Training Platform" />
<meta property="og:locale" content="ar_SA" />
<!-- or en_US -->
<meta property="og:locale:alternate" content="en_US" />
<!-- or ar_SA -->
```
````

**Twitter Card Tags:**

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{seoTitle}" />
<meta name="twitter:description" content="{seoDescription}" />
<meta name="twitter:image" content="{imageUrl | og-default.png}" />
```

**Acceptance Criteria:**

- [ ] All public pages include complete og:title, og:description, og:image, og:url tags
- [ ] og:image resolves to a valid image URL (course image or default fallback)
- [ ] og:locale reflects the active language (ar_SA or en_US)
- [ ] Twitter Card tags present on all public pages
- [ ] Admin and auth pages do NOT include OG tags
- [ ] OG image dimensions: 1200×630px minimum for course/program images

---

### P0-F029 — SEO: Schema.org Structured Data

**Description:**
JSON-LD structured data blocks are injected into the document head on relevant pages.
This enables Google rich results (course cards, breadcrumbs, organization knowledge panel).

**User Story:**
As a search engine, I want to read structured data on course pages so that I can display
rich results such as course cards directly in search results.

**Trigger:** User or crawler loads a public page with structured data.

**Pre-conditions:**

- Course detail page has all required fields (name, description, price, duration)
- Organization details configured in environment or CMS settings

**Structured Data by Page:**

**Landing Page — Organization Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MA Training Platform",
  "url": "https://matraining.com",
  "logo": "https://matraining.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": ["Arabic", "English"]
  }
}
```

**Course Detail Page — Course Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "{course.titleEn}",
  "description": "{course.descriptionEn}",
  "provider": {
    "@type": "Organization",
    "name": "MA Training Platform"
  },
  "offers": {
    "@type": "Offer",
    "price": "{course.price}",
    "priceCurrency": "SAR",
    "availability": "https://schema.org/InStock"
  },
  "inLanguage": ["ar", "en"],
  "educationalLevel": "Professional"
}
```

**Category / Course Pages — BreadcrumbList Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://matraining.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{program.nameEn}",
      "item": "https://matraining.com/programs/{slug}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{course.titleEn}",
      "item": "https://matraining.com/courses/{slug}"
    }
  ]
}
```

**Acceptance Criteria:**

- [ ] Landing page includes Organization JSON-LD
- [ ] Every course detail page includes Course JSON-LD with name, description, price, provider
- [ ] Category and course pages include BreadcrumbList JSON-LD
- [ ] JSON-LD validates without errors in Google's Rich Results Test
- [ ] JSON-LD injected via @vueuse/head as a `<script type="application/ld+json">` tag
- [ ] Structured data reflects active language content (EN for English, AR for Arabic)

---

### P0-F030 — SEO: Canonical URLs

**Description:**
Every public page has a canonical link tag pointing to the definitive URL for that page.
This prevents duplicate content issues between Arabic and English versions of the same page.

**User Story:**
As the system, I must ensure search engines do not penalize the platform for duplicate content
between the Arabic and English versions of course pages.

**Trigger:** Any public page is loaded.

**Main Flow:**

1. Vue Router resolves current route and active language
2. `useHead()` injects `<link rel="canonical" href="{baseUrl}{currentPath}">` without language prefix
3. For language-specific pages: canonical always points to the primary language version
4. Pagination pages: canonical points to first page

**Canonical URL Patterns:**
| Page | Canonical URL |
|---------------------|---------------------------------------------------|
| Landing | https://matraining.com/ |
| Programs | https://matraining.com/programs |
| Program | https://matraining.com/programs/{slug} |
| Course | https://matraining.com/courses/{slug} |

**Acceptance Criteria:**

- [ ] Every public page contains exactly one `<link rel="canonical">` tag
- [ ] Canonical URL does not include query parameters or language prefixes
- [ ] Canonical URL matches the primary accessible URL for that content
- [ ] Admin and auth pages do not have canonical tags

---

### P0-F031 — SEO: hreflang Tags

**Description:**
All bilingual public pages include hreflang link tags declaring the Arabic and English
language versions. This enables Google to serve the correct language version to searchers
in different regions.

**User Story:**
As a search engine, I need hreflang tags to understand which URL serves Arabic-speaking
users and which serves English-speaking users for the same content.

**Trigger:** Any public bilingual page is loaded.

**hreflang Tag Structure:**

```html
<link
  rel="alternate"
  hreflang="ar"
  href="https://matraining.com/ar/courses/{slug}"
/>
<link
  rel="alternate"
  hreflang="en"
  href="https://matraining.com/en/courses/{slug}"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://matraining.com/courses/{slug}"
/>
```

**URL Strategy for i18n:**

- Arabic: `/ar/{route}` — RTL layout
- English: `/en/{route}` — LTR layout
- Default (x-default): canonical URL without language prefix

**Acceptance Criteria:**

- [ ] All public pages include hreflang="ar", hreflang="en", and hreflang="x-default" tags
- [ ] hreflang URLs are absolute (include https:// and domain)
- [ ] Both language URLs resolve to valid, non-404 pages
- [ ] Admin and auth pages do not include hreflang tags
- [ ] x-default points to the canonical default URL

---

### P0-F032 — SEO: Slug-Based URLs

**Description:**
All public content URLs use human-readable, SEO-friendly slugs instead of UUIDs. Slugs
are generated from the English name of the content, stored in the database, and must be
unique per entity type.

**User Story:**
As a search engine and as a user, I want URLs like `/programs/leadership-development` instead
of `/programs/f47ac10b-58cc-4372-a567` so that URLs are readable and keyword-rich.

**Slug Generation Rules:**

- Generated from nameEn / titleEn at time of creation
- Lowercase, hyphen-separated, alphanumeric only
- Maximum 80 characters
- Unique per entity type (program slugs unique among programs, etc.)
- Stored in database as `slug` field on Program, Category, Course tables
- Admin can override the auto-generated slug

**URL Structure:**
| Route | Old (UUID) | New (Slug) |
|--------------------------------------------|-----------------------------------|-----------------------------------------|
| Program listing | /programs | /programs |
| Program detail | /programs/:id | /programs/:slug |
| Category listing | /programs/:id/categories | /programs/:slug/categories |
| Course listing | /categories/:id/courses | /programs/:slug/categories/:catSlug |
| Course detail | /courses/:id | /courses/:slug |

**Acceptance Criteria:**

- [ ] All public routes use slug-based URLs
- [ ] Slugs generated automatically from English name on create; editable by admin
- [ ] Duplicate slugs rejected with validation error: "This slug is already in use"
- [ ] Old UUID-based routes return 301 redirect to slug-based URL (if previously used)
- [ ] Slugs stored in database schema on Program, Category, and Course tables
- [ ] Vue Router resolves slug-based routes correctly for all content pages

---

### P0-F033 — SEO: sitemap.xml

**Description:**
A dynamically generated sitemap.xml is served by the Node.js backend at `/sitemap.xml`.
It includes all public program, category, and course pages in both Arabic and English,
updated automatically when content is created or deleted via admin CRUD.

**User Story:**
As a search engine crawler, I need a sitemap.xml to discover and index all course and
program pages efficiently without relying solely on link crawling.

**Trigger:** GET /sitemap.xml request from crawler or Google Search Console.

**Pre-conditions:**

- At least one active Program, Category, and Course exists
- SITE_URL configured in backend environment variables

**Main Flow:**

1. Crawler or admin sends GET /sitemap.xml
2. Node.js controller queries all active Programs, Categories, Courses from PostgreSQL
3. Controller generates XML sitemap with all public URLs in both languages
4. Response returned with `Content-Type: application/xml`
5. Sitemap cached in Redis for 1 hour; invalidated on admin CRUD operations

**Sitemap Entry Structure:**

```xml
<url>
  <loc>https://matraining.com/en/courses/leadership-essentials</loc>
  <lastmod>2026-04-06</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
  <xhtml:link rel="alternate" hreflang="ar" href="https://matraining.com/ar/courses/leadership-essentials"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://matraining.com/en/courses/leadership-essentials"/>
</url>
```

**Priority by Page Type:**
| Page Type | Priority | Change Frequency |
|--------------|----------|------------------|
| Landing Page | 1.0 | monthly |
| Programs | 0.9 | weekly |
| Categories | 0.8 | weekly |
| Courses | 0.8 | weekly |
| Static Pages | 0.5 | monthly |

**Acceptance Criteria:**

- [ ] GET /sitemap.xml returns valid XML with correct Content-Type header
- [ ] All active programs, categories, and courses included in both AR and EN URLs
- [ ] Sitemap validates without errors in Google Search Console
- [ ] Sitemap cached in Redis and invalidated on content CRUD operations
- [ ] lastmod reflects actual updatedAt timestamp from database
- [ ] Admin and auth pages are NOT included in the sitemap
- [ ] Sitemap includes hreflang alternate links per entry

---

### P0-F034 — SEO: robots.txt

**Description:**
A robots.txt file served at `/robots.txt` instructs search engine crawlers which pages
to index and which to block. Admin portal, auth pages, and API routes are blocked.
Public content pages are allowed.

**User Story:**
As the system, I must ensure search engines index only public-facing content pages and
never crawl the admin portal, authenticated customer routes, or API endpoints.

**robots.txt Content:**

```
User-agent: *
Allow: /
Allow: /programs/
Allow: /courses/
Allow: /en/
Allow: /ar/

Disallow: /admin/
Disallow: /customer/
Disallow: /login
Disallow: /register
Disallow: /api/
Disallow: /403
Disallow: /404

Sitemap: https://matraining.com/sitemap.xml
```

**Acceptance Criteria:**

- [ ] GET /robots.txt returns correct plain text with Content-Type: text/plain
- [ ] /admin/_ and /customer/_ routes are disallowed
- [ ] /login and /register are disallowed
- [ ] /api/\* routes are disallowed
- [ ] All /programs/_ and /courses/_ routes are allowed
- [ ] Sitemap URL included at the bottom of robots.txt
- [ ] robots.txt served as a static file from Node.js (no auth required)

---

### P0-F035 — SEO: Admin Meta Management

**Description:**
The Admin portal includes an SEO panel on the Program and Course edit forms. Admins can
set custom SEO title, meta description, and keywords for each piece of content. Fields
include character count indicators and preview of how the result will appear in Google.

**User Story:**
As a platform administrator, I want to customize the SEO title and description for each
course so that our pages rank well and have compelling search result copy.

**Trigger:** Admin opens the edit form for a Program or Course.

**Pre-conditions:**

- Program or Course edit form is open
- SEO fields (seoTitle, seoDescription, seoKeywords, slug) exist in the database schema

**SEO Panel Fields:**
| Field | Max Length | Auto-generated From | Editable |
|-----------------|------------|-----------------------------|----------|
| SEO Title | 60 chars | nameEn / titleEn | Yes |
| Meta Description| 160 chars | descriptionEn (truncated) | Yes |
| Keywords | 255 chars | — | Yes |
| Slug | 80 chars | nameEn / titleEn (slugified)| Yes |

**Google SERP Preview:**

```
MA Training Platform — Leadership Essentials
https://matraining.com/courses/leadership-essentials
Develop essential leadership skills for corporate managers. 3-day intensive course
available in Riyadh, Jeddah, and online. Book your team's slot today.
```

**Acceptance Criteria:**

- [ ] SEO panel visible on Program and Course edit forms
- [ ] Character count shown in real time for title (max 60) and description (max 160)
- [ ] Title and description fields show red border when limit exceeded
- [ ] Google SERP preview renders below the fields showing how result will appear
- [ ] Slug field editable with real-time duplicate validation
- [ ] SEO fields saved to database on form submission
- [ ] If SEO title not set, API returns nameEn as fallback for meta tag injection

---

### P0-F036 — SEO: Semantic HTML Structure

**Description:**
All public-facing pages use correct semantic HTML — one H1 per page, proper H2/H3 hierarchy,
landmark elements, descriptive alt text on all images, and structured navigation.
This supports both SEO ranking and WCAG 2.1 AA accessibility compliance.

**Semantic HTML Rules:**

- Each public page has exactly one `<h1>` tag matching the page's primary keyword
- Supporting sections use `<h2>` and `<h3>` in logical order
- Navigation wrapped in `<nav>` with `aria-label`
- Main content wrapped in `<main>`
- Footer wrapped in `<footer>`
- All images have descriptive `alt` attributes (not empty, not "image")
- Course cards use `<article>` elements
- Breadcrumbs use `<nav aria-label="breadcrumb">` with `<ol>` list

**H1 Strategy per Page:**
| Page | H1 Content |
|-------------------|-------------------------------------------------|
| Landing | "Corporate Training Programs — MA Training Platform" |
| Programs Listing | "Browse Training Programs" |
| Program Detail | {program.nameEn} |
| Course Detail | {course.titleEn} |

**Acceptance Criteria:**

- [ ] Every public page has exactly one `<h1>` tag
- [ ] H1/H2/H3 hierarchy is logical and never skips levels
- [ ] All images have non-empty, descriptive alt attributes in the active language
- [ ] `<main>`, `<nav>`, `<footer>` landmark elements present on all pages
- [ ] Course cards use `<article>` elements
- [ ] Breadcrumbs use `<ol>` inside `<nav aria-label="breadcrumb">`
- [ ] No decorative images have meaningful alt text (use alt="" for purely decorative images)

---

## Section 8 — Non-Functional Requirements

### Performance

- Frontend LCP: under 2.5 seconds on standard broadband
- API response time (p95): under 500ms for all standard endpoints
- Cached listing endpoints: under 100ms via Redis
- Vue route transitions: under 300ms with lazy-loaded chunks
- No single Vite build chunk exceeds 250KB gzipped
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, FID < 100ms

### Security

- All protected API routes validated with JWT middleware
- Refresh token stored in HTTP-only, Secure, SameSite=Strict cookie
- Access token stored in Pinia memory only — never in localStorage
- All inputs validated server-side with Zod before database operations
- File uploads restricted by MIME type and size via Multer middleware
- SQL injection prevented by Prisma parameterized queries
- CORS configured to allow only trusted frontend origins
- HTTPS enforced on all environments

### SEO Technical Standards

- All public pages must pass Google Rich Results Test without errors
- Sitemap.xml must validate in Google Search Console
- robots.txt must correctly block admin and auth routes
- Page titles: 30–60 characters; meta descriptions: 120–160 characters
- No duplicate title or description tags across any two pages
- All structured data (JSON-LD) validates against schema.org specification
- hreflang implementation must pass hreflang validator tools
- Canonical tags present on 100% of public pages

### Availability

- Target uptime: 99.9% excluding scheduled maintenance

### Scalability

- Vue 3 lazy-loaded portal modules loaded independently
- Redis caching on all high-read endpoints and sitemap
- Prisma connection pooling configured for PostgreSQL
- Stateless Node.js API — horizontally scalable

### Accessibility

- WCAG 2.1 AA compliance across all pages
- All interactive elements keyboard-navigable
- ARIA labels on all icon-only buttons
- Minimum color contrast ratio 4.5:1
- Full RTL accessibility for Arabic

### Compatibility

- Chrome 100+, Safari 15+, Firefox 100+, Edge 100+

### Observability

- Structured JSON error logging (Winston or Pino)
- Vue global error handler captures unhandled frontend errors
- Alert trigger: API error rate exceeds 1% in any 5-minute window
- Core Web Vitals tracked via Lighthouse CI post-launch

---

## Section 9 — Technical Architecture

### Frontend Stack

| Layer            | Technology                                                   |
| ---------------- | ------------------------------------------------------------ |
| Framework        | Vue 3 (Composition API + script setup + SFC)                 |
| Build Tool       | Vite (latest stable)                                         |
| Language         | TypeScript (strict mode)                                     |
| Styling          | Tailwind CSS v3 + tailwindcss-rtl plugin                     |
| State Management | Pinia                                                        |
| Routing          | Vue Router 4 (lazy-loaded Customer and Admin modules)        |
| i18n             | vue-i18n v9 (AR/EN with RTL/LTR global switching)            |
| HTTP Client      | Axios (JWT interceptor + 401 refresh flow)                   |
| Form Validation  | VeeValidate v4 + Zod                                         |
| SEO Head Mgmt    | @vueuse/head (dynamic meta, OG, Twitter, JSON-LD, canonical) |
| Date Handling    | Day.js                                                       |
| Icons            | Heroicons v2 or Phosphor Icons                               |
| UI Components    | Headless UI for Vue (unstyled — styled with Tailwind)        |

### Backend Stack

| Layer       | Technology                                          |
| ----------- | --------------------------------------------------- |
| Runtime     | Node.js (LTS)                                       |
| Framework   | Express.js with TypeScript                          |
| ORM         | Prisma (type-safe database client)                  |
| Database    | PostgreSQL (primary data store)                     |
| Cache       | Redis (listing cache, sitemap cache, session store) |
| Auth        | JWT (jsonwebtoken) + bcrypt                         |
| Validation  | Zod                                                 |
| File Upload | Multer                                              |
| Sitemap     | Custom XML generator served at /sitemap.xml         |
| robots.txt  | Static file served by Express                       |
| Email       | Nodemailer (booking confirmations — P1)             |
| Logging     | Winston or Pino (structured JSON logs)              |

### SEO Implementation Architecture

```
Frontend (Vue 3 + @vueuse/head)
├── composables/
│   └── useSeo.ts           # Reusable SEO composable
│       ├── useHead()       # Injects title, description, canonical
│       ├── useOgTags()     # Injects Open Graph + Twitter Card tags
│       ├── useJsonLd()     # Injects JSON-LD script tags
│       └── useHreflang()   # Injects hreflang link tags
├── config/
│   └── seo.config.ts       # Default meta values, OG image URL, site name
└── modules/
    └── customer/views/
        ├── LandingView.vue          # Organization schema
        ├── ProgramsView.vue         # Programs listing meta
        ├── CourseDetailView.vue     # Course schema + BreadcrumbList
        └── ...

Backend (Node.js + Express)
├── routes/
│   ├── GET /sitemap.xml    # Dynamic XML sitemap generator
│   └── GET /robots.txt     # Static robots.txt
├── services/
│   └── sitemap.service.ts  # Queries DB, builds XML, caches in Redis
└── middleware/
    └── seoHeaders.ts       # Sets X-Robots-Tag header for API routes
```

### useSeo Composable (Implementation Pattern)

```typescript
// composables/useSeo.ts
import { useHead } from "@vueuse/head";
import { useI18n } from "vue-i18n";

interface SeoOptions {
  title: string;
  description: string;
  keywords?: string;
  imageUrl?: string;
  canonicalPath: string;
  noindex?: boolean;
  jsonLd?: object;
}

export function useSeo(options: SeoOptions) {
  const { locale } = useI18n();
  const baseUrl = import.meta.env.VITE_SITE_URL;
  const ogLocale = locale.value === "ar" ? "ar_SA" : "en_US";
  const altLocale = locale.value === "ar" ? "en_US" : "ar_SA";
  const altLang = locale.value === "ar" ? "en" : "ar";
  const altPath = `/${altLang}${options.canonicalPath}`;

  useHead({
    title: options.title,
    meta: [
      { name: "description", content: options.description },
      ...(options.keywords
        ? [{ name: "keywords", content: options.keywords }]
        : []),
      {
        name: "robots",
        content: options.noindex ? "noindex, nofollow" : "index, follow",
      },
      // Open Graph
      { property: "og:title", content: options.title },
      { property: "og:description", content: options.description },
      {
        property: "og:image",
        content: options.imageUrl || `${baseUrl}/og-default.png`,
      },
      { property: "og:url", content: `${baseUrl}${options.canonicalPath}` },
      { property: "og:site_name", content: "MA Training Platform" },
      { property: "og:locale", content: ogLocale },
      { property: "og:locale:alternate", content: altLocale },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: options.title },
      { name: "twitter:description", content: options.description },
      {
        name: "twitter:image",
        content: options.imageUrl || `${baseUrl}/og-default.png`,
      },
    ],
    link: [
      { rel: "canonical", href: `${baseUrl}${options.canonicalPath}` },
      {
        rel: "alternate",
        hreflang: locale.value,
        href: `${baseUrl}/${locale.value}${options.canonicalPath}`,
      },
      { rel: "alternate", hreflang: altLang, href: `${baseUrl}${altPath}` },
      {
        rel: "alternate",
        hreflang: "x-default",
        href: `${baseUrl}${options.canonicalPath}`,
      },
    ],
    script: options.jsonLd
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(options.jsonLd),
          },
        ]
      : [],
  });
}
```

### Prisma Schema Updates for SEO

```prisma
model TrainingProgram {
  id            String     @id @default(uuid())
  nameAr        String
  nameEn        String
  slug          String     @unique  // SEO-friendly URL slug
  descriptionAr String
  descriptionEn String
  seoTitle      String?             // Custom SEO title (max 60 chars)
  seoDescription String?            // Custom meta description (max 160 chars)
  seoKeywords   String?             // Comma-separated keywords
  imageUrl      String?
  status        Status     @default(ACTIVE)
  updatedAt     DateTime   @updatedAt
  createdAt     DateTime   @default(now())
  categories    Category[]
}

model Category {
  id            String          @id @default(uuid())
  programId     String
  program       TrainingProgram @relation(fields: [programId], references: [id], onDelete: Cascade)
  nameAr        String
  nameEn        String
  slug          String          @unique
  descriptionAr String?
  descriptionEn String?
  status        Status          @default(ACTIVE)
  updatedAt     DateTime        @updatedAt
  courses       Course[]
}

model Course {
  id             String     @id @default(uuid())
  categoryId     String
  category       Category   @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  titleAr        String
  titleEn        String
  slug           String     @unique  // SEO-friendly URL slug
  descriptionAr  String
  descriptionEn  String
  seoTitle       String?             // Custom SEO title
  seoDescription String?             // Custom meta description
  seoKeywords    String?             // Comma-separated keywords
  duration       String
  price          Decimal
  trainerInfo    String?
  imageUrl       String?
  status         Status     @default(ACTIVE)
  updatedAt      DateTime   @updatedAt
  createdAt      DateTime   @default(now())
  schedules      Schedule[]
  purchases      Purchase[]
  bookings       Booking[]
}
```

### API Additions for SEO

| Method | Endpoint                   | Auth   | Description                                              |
| ------ | -------------------------- | ------ | -------------------------------------------------------- |
| GET    | /sitemap.xml               | Public | Auto-generated XML sitemap                               |
| GET    | /robots.txt                | Public | robots.txt crawl rules                                   |
| GET    | /api/v1/programs/:slug     | JWT    | Get program by slug (replaces :id)                       |
| GET    | /api/v1/courses/:slug      | JWT    | Get course by slug (replaces :id)                        |
| PUT    | /api/v1/admin/programs/:id | ADMIN  | Now includes seoTitle, seoDescription, seoKeywords, slug |
| PUT    | /api/v1/admin/courses/:id  | ADMIN  | Now includes seoTitle, seoDescription, seoKeywords, slug |

---

## Section 10 — Implementation Phases

### Phase 1 — Foundation (Weeks 1–2)

**Goal:** Project infrastructure, authentication, portal separation, i18n, and interceptors.

- [ ] Initialize Vue 3 + Vite + TypeScript project
- [ ] Configure Tailwind CSS v3 with tailwindcss-rtl plugin
- [ ] Install and configure @vueuse/head globally in main.ts
- [ ] Set up Vue Router 4 with lazy-loaded Customer and Admin module routes
- [ ] Create CustomerLayout.vue, AdminLayout.vue, and PublicLayout.vue
- [ ] Configure Pinia stores: auth.store, ui.store
- [ ] Configure vue-i18n v9 with ar.json and en.json locale files
- [ ] Implement RTL/LTR global switching without page reload
- [ ] Build Axios instance with JWT attach interceptor and 401 refresh flow
- [ ] Build Registration page (P0-F001)
- [ ] Build Login page with role-based redirect (P0-F002)
- [ ] Implement Vue Router beforeEach role guard (P0-F003)
- [ ] Build 403 and 404 error pages with noindex meta tags
- [ ] Initialize Node.js + Express + TypeScript project
- [ ] Configure Prisma with PostgreSQL — add slug, seoTitle, seoDescription, seoKeywords, updatedAt fields
- [ ] Configure Redis client
- [ ] Build authenticateJWT and requireRole middleware
- [ ] Implement all auth endpoints
- [ ] Create useSeo.ts composable with useHead, OG, Twitter, hreflang, JSON-LD
- [ ] Create seo.config.ts with site-wide defaults
- [ ] Set up GitHub Actions: lint + Vite build check

**Validation:** Auth works end-to-end. useSeo composable injects correct tags verified in browser DevTools.

---

### Phase 2 — Core Customer Features + SEO Tags (Weeks 3–4)

**Goal:** Full customer hierarchy, course detail, purchase, booking, and per-page SEO injection.

- [ ] Build Landing Page with hero and banner (P0-F004) with Organization JSON-LD
- [ ] Implement schedule file download (P0-F005)
- [ ] Build Training Programs listing page with meta tags (P0-F006, P0-F027)
- [ ] Build Categories listing page with breadcrumb and BreadcrumbList schema (P0-F007)
- [ ] Build Courses listing page (P0-F008)
- [ ] Build Course Detail page with Course JSON-LD + BreadcrumbList (P0-F009, P0-F029)
- [ ] Apply Open Graph + Twitter Card tags on all public pages (P0-F028)
- [ ] Apply canonical tags on all public pages (P0-F030)
- [ ] Apply hreflang tags on all bilingual public pages (P0-F031)
- [ ] Implement slug-based Vue Router routes for programs and courses (P0-F032)
- [ ] Implement semantic HTML H1/H2/H3 hierarchy on all public pages (P0-F036)
- [ ] Build Course Purchase flow (P0-F010)
- [ ] Build Course Booking flow (P0-F011)
- [ ] Connect all pages to Pinia stores and service layer
- [ ] Implement all content API endpoints with slug resolution

**Validation:** All public pages pass Google Rich Results Test. Canonical, hreflang, and OG tags verified. Course JSON-LD validates in schema.org validator.

---

### Phase 3 — Admin Portal + SEO Management (Weeks 5–6)

**Goal:** Complete admin portal with full CRUD, file management, and SEO metadata editing.

- [ ] Build Admin Dashboard with summary stats (P1-F004)
- [ ] Build Programs CRUD interface with SEO panel (P0-F012, P0-F035)
- [ ] Build Categories CRUD interface (P0-F013)
- [ ] Build Courses CRUD interface with SEO panel (P0-F014, P0-F035)
- [ ] Implement SEO panel: title (60 char), description (160 char), keywords, slug fields
- [ ] Implement SERP preview component in admin SEO panel
- [ ] Implement real-time character count indicators
- [ ] Implement slug duplicate validation
- [ ] Build Schedule Management interface (P0-F015)
- [ ] Build Schedule File upload interface (P0-F016)
- [ ] Implement GET /sitemap.xml with dynamic XML generation and Redis caching (P0-F033)
- [ ] Implement GET /robots.txt as static Express route (P0-F034)
- [ ] Implement sitemap cache invalidation on all admin CRUD operations
- [ ] Connect all admin views to API service layer

**Validation:** Admin can set custom SEO title/description. sitemap.xml validates in Google Search Console. robots.txt blocks correct routes. SERP preview renders correctly.

---

### Phase 4 — Polish, P1 SEO Features & Launch Hardening (Weeks 7–8)

**Goal:** P1 features, SEO audit, responsive design, and production deployment.

- [ ] Implement Course Search and Filter (P1-F001)
- [ ] Build Company Booking History page (P1-F002)
- [ ] Implement Nodemailer booking confirmation email (P1-F003)
- [ ] Implement full responsive layout (P1-F005)
- [ ] Implement XML Sitemap Index separating programs, courses, and static pages (P1-F006)
- [ ] Audit and fix all image alt text across public pages (P1-F008)
- [ ] Run Lighthouse CI audit — enforce LCP < 2.5s, CLS < 0.1 (P1-F009)
- [ ] Full RTL/LTR visual QA — verified by Arabic speaker
- [ ] Cross-browser testing: Chrome, Safari, Firefox, Edge
- [ ] Validate all JSON-LD via Google Rich Results Test (all pages must pass)
- [ ] Validate sitemap.xml in Google Search Console
- [ ] Validate hreflang via hreflang checker tools
- [ ] Check for duplicate title/description tags across all pages
- [ ] Security review: token handling, CORS, input sanitization
- [ ] Staging deployment and UAT with stakeholders
- [ ] Fix all critical bugs from UAT
- [ ] Production deployment
- [ ] Submit sitemap.xml to Google Search Console and Bing Webmaster Tools

**Validation:** All P0 and P1 acceptance criteria pass. SEO audit shows zero critical errors. Platform live on production with sitemap submitted.

---

## Section 11 — Advanced Execution Rules

### User Flow — Customer (SEO-Enhanced Discovery)

1. Customer searches "corporate training programs Saudi Arabia" on Google
2. Google shows MA Training Platform course page in results with rich snippet (Course schema)
3. Customer clicks result → lands on `/en/courses/leadership-essentials`
4. Page loads with correct H1, meta description, and breadcrumb
5. Customer browses program hierarchy
6. Customer clicks "Register" → completes bilingual registration form
7. Customer purchases and books the course
8. Booking reference number confirmed

### Edge Cases — SEO Specific

| Condition                                | System Behavior                                         | User/Crawler Feedback                                 |
| ---------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| Course has no seoTitle set               | API returns nameEn as fallback                          | Title renders as: "{titleEn} — MA Training Platform"  |
| Course has no image                      | OG image falls back to /og-default.png                  | Social share preview shows default platform image     |
| Duplicate slug submitted                 | Backend returns 409; frontend shows inline error        | "This slug is already in use. Please choose another." |
| Admin deletes a course with indexed URL  | Old URL returns 404 — log for manual redirect review    | 404 page with noindex meta tag                        |
| Sitemap Redis cache miss                 | Node.js regenerates from DB; stores in Redis for 1hr    | Crawler receives fresh sitemap                        |
| Crawler hits /admin/\* route             | robots.txt blocks; returns Disallow in crawler response | Crawler skips admin routes                            |
| hreflang URL returns 404                 | Log warning; sitemap service skips inactive content     | Valid hreflang pair always points to active URLs only |
| SEO title exceeds 60 chars in admin form | Character counter shows red; form submission blocked    | "SEO title must be 60 characters or fewer"            |
| Meta description exceeds 160 chars       | Character counter shows red; form submission blocked    | "Meta description must be 160 characters or fewer"    |

### UX Rules (Applied Globally)

- All forms validate inline on blur; errors clear immediately when corrected
- Every API call shows a loading skeleton or spinner during pending state
- Every successful action shows a success toast for 3 seconds (auto-dismiss)
- All destructive actions require a confirmation dialog
- RTL layout applied globally when Arabic is selected — no page reload
- All icon-only buttons carry ARIA labels in the active language
- Empty states include an illustration, a message, and a CTA

---

## Section 12 — Success Metrics & KPIs

### Business Metrics

| Metric                    | Target          | Measurement Method                          | Owner |
| ------------------------- | --------------- | ------------------------------------------- | ----- |
| Course bookings per month | 50+ in month 1  | COUNT of Booking records per month          | Aziza |
| Company registrations     | 30+ in 30 days  | COUNT of User records with CUSTOMER role    | Aziza |
| Schedule file downloads   | 100+ in month 1 | Request count on GET /schedule/download     | Aziza |
| Purchase conversion rate  | > 40%           | Purchase records / Course detail page views | Aziza |

### SEO Metrics

| Metric                            | Target                         | Measurement Method                     | Owner        |
| --------------------------------- | ------------------------------ | -------------------------------------- | ------------ |
| Google Search Console impressions | 500+ in month 1                | GSC Performance report                 | Aziza        |
| Indexed pages                     | 100% of active pages           | GSC Coverage report                    | Frontend Dev |
| Rich result eligibility           | 100% of course pages           | Google Rich Results Test (zero errors) | Frontend Dev |
| Core Web Vitals — LCP             | < 2.5s                         | Lighthouse CI                          | Frontend Dev |
| Core Web Vitals — CLS             | < 0.1                          | Lighthouse CI                          | Frontend Dev |
| Sitemap coverage                  | 100% of public URLs            | GSC Sitemap report                     | Backend Dev  |
| Organic search traffic            | 200+ sessions/month by month 3 | Google Analytics or PostHog            | Aziza        |

### Product & Technical Metrics

| Metric                  | Target  | Measurement Method                       | Owner       |
| ----------------------- | ------- | ---------------------------------------- | ----------- |
| Booking completion rate | > 80%   | Confirmed Bookings / Booking flow starts | Aziza       |
| API error rate          | < 0.1%  | 5xx responses / Total requests           | Backend Dev |
| API response time (p95) | < 500ms | Server-side request duration logging     | Backend Dev |

**Tracking Tool:** PostHog + Google Search Console
**Review Cadence:** 1 week → 2 weeks → 30 days → 90 days post-launch
**Metric Owner:** Aziza

---

## Section 13 — Timeline & Milestones

**Start Date:** 2026-04-06
**Target Launch Date:** 2026-06-01
**Total Duration:** 8 weeks

| Milestone               | Description                                            | Due Date   | Status  | Owner        |
| ----------------------- | ------------------------------------------------------ | ---------- | ------- | ------------ |
| Kickoff                 | Project kickoff, environment setup, team alignment     | 2026-04-06 | Pending | Aziza        |
| PRD Approved            | Stakeholder sign-off on PRD v1.2                       | 2026-04-08 | Pending | Aziza        |
| DB Schema Finalized     | Prisma schema with SEO fields reviewed and migrated    | 2026-04-10 | Pending | Backend Dev  |
| useSeo Composable Ready | SEO composable built and tested in isolation           | 2026-04-15 | Pending | Frontend Dev |
| Phase 1 Complete        | Auth, routing, i18n, SEO composable live on staging    | 2026-04-20 | Pending | Full Team    |
| Phase 2 Complete        | Customer hierarchy, SEO tags, purchase, booking live   | 2026-05-04 | Pending | Full Team    |
| Phase 3 Complete        | Admin portal, SEO management, sitemap, robots.txt live | 2026-05-18 | Pending | Full Team    |
| Phase 4 Complete        | P1 features, SEO audit passed, responsive hardened     | 2026-05-25 | Pending | Full Team    |
| UAT Sign-Off            | Stakeholder UAT and SEO review complete                | 2026-05-28 | Pending | Aziza        |
| Beta Launch             | Platform live on staging for invited company users     | 2026-05-29 | Pending | Tech Lead    |
| Public Launch           | Production deployment; sitemap submitted to GSC + Bing | 2026-06-01 | Pending | Aziza        |

---

## Section 14 — Risk Register

| ID  | Description                                 | Likelihood | Impact | Score | Mitigation                                                                                                          | Owner        |
| --- | ------------------------------------------- | ---------- | ------ | ----- | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| R01 | Backend API not ready in sync with frontend | High       | High   | 9     | Use MSW for API mocking during frontend development                                                                 | Tech Lead    |
| R02 | Scope creep from stakeholder requests       | Medium     | High   | 6     | Enforce MoSCoW; new requests go to v2 backlog                                                                       | Aziza        |
| R03 | RTL layout inconsistencies                  | High       | Medium | 6     | Dedicated RTL QA pass in Phase 4; native Arabic speaker test                                                        | Frontend Dev |
| R04 | PostgreSQL/Redis infrastructure not ready   | Medium     | High   | 6     | Provision infrastructure in Week 1 before backend coding                                                            | Backend Dev  |
| R05 | Race condition on booking capacity          | Medium     | High   | 6     | Atomic DB increment; return 409 on conflict                                                                         | Backend Dev  |
| R06 | SEO tags not rendering for crawlers (CSR)   | Medium     | High   | 6     | Validate with Google Search Console URL inspection tool post-launch; consider prerendering for critical pages in v2 | Frontend Dev |
| R07 | Duplicate slugs on bulk content creation    | Medium     | Medium | 4     | Unique DB constraint on slug fields; backend returns 409 on conflict                                                | Backend Dev  |
| R08 | i18n translation content not ready on time  | Medium     | Medium | 4     | Provide locale skeleton in Week 1; assign translation owner early                                                   | Aziza        |
| R09 | sitemap.xml grows too large (500+ URLs)     | Low        | Medium | 2     | Implement sitemap index with separate files per content type                                                        | Backend Dev  |
| R10 | Key developer unavailability                | Low        | High   | 3     | Document all decisions; no single-person knowledge silos                                                            | Aziza        |

**Score = Likelihood × Impact (High=3, Medium=2, Low=1)**

---

## Section 15 — Stakeholders & Approvals

### Stakeholders

| Name  | Role             | Involvement                                                | Contact |
| ----- | ---------------- | ---------------------------------------------------------- | ------- |
| Aziza | Owner / PM       | Full project oversight, PRD approval, UAT sign-off         | [TBD]   |
| [TBD] | Engineering Lead | Technical architecture, sprint oversight, infrastructure   | [TBD]   |
| [TBD] | Frontend Dev     | Vue 3 + Vite + TypeScript + Tailwind + @vueuse/head        | [TBD]   |
| [TBD] | Backend Dev      | Node.js + Express + Prisma + sitemap.xml + robots.txt      | [TBD]   |
| [TBD] | Designer         | UI/UX design, Tailwind system, RTL layout, OG image design | [TBD]   |
| [TBD] | QA Engineer      | Test cases, acceptance criteria, SEO tag verification      | [TBD]   |

### Approval Gates

| Gate                              | Approver         | Required By | Status  |
| --------------------------------- | ---------------- | ----------- | ------- |
| PRD v1.2 Approval                 | Aziza            | 2026-04-08  | Pending |
| SEO Strategy Sign-Off             | Aziza            | 2026-04-09  | Pending |
| Database Schema Sign-Off          | Engineering Lead | 2026-04-10  | Pending |
| Technical Architecture Sign-Off   | Engineering Lead | 2026-04-10  | Pending |
| Design System + OG Image Approval | Aziza + Designer | 2026-04-13  | Pending |
| Phase 1 QA Sign-Off               | QA Engineer      | 2026-04-20  | Pending |
| Phase 2 SEO QA Sign-Off           | QA + Aziza       | 2026-05-04  | Pending |
| Phase 3 SEO Mgmt + Sitemap QA     | QA Engineer      | 2026-05-18  | Pending |
| UAT Sign-Off                      | Aziza            | 2026-05-28  | Pending |
| Production Launch Approval        | Aziza            | 2026-06-01  | Pending |

---

## Section 16 — References & Links

| Resource                 | Link / Location                                      |
| ------------------------ | ---------------------------------------------------- |
| Design Files             | [TBD]                                                |
| Repository               | [TBD]                                                |
| API Documentation        | [TBD] — Postman Collection or Swagger UI             |
| Prisma Schema File       | prisma/schema.prisma in repository                   |
| Architecture Diagram     | [TBD]                                                |
| Sitemap URL              | https://matraining.com/sitemap.xml                   |
| robots.txt URL           | https://matraining.com/robots.txt                    |
| Google Search Console    | [TBD — post-launch]                                  |
| Bing Webmaster Tools     | [TBD — post-launch]                                  |
| Google Rich Results Test | https://search.google.com/test/rich-results          |
| Schema.org Validator     | https://validator.schema.org/                        |
| hreflang Validator       | https://www.hreflang.org/checker/                    |
| Staging Environment      | [TBD]                                                |
| Production Environment   | [TBD]                                                |
| CI/CD Pipeline           | GitHub Actions — [TBD]                               |
| Monitoring Dashboard     | [TBD]                                                |
| Reference Platform       | https://www.actksa.com/ar/actrain-schedule/2025_v002 |
| Slack / Communication    | [TBD]                                                |
| Related PRDs             | None — this is the initial PRD                       |

---

## Section 17 — Revision History

| Version | Date       | Author | Changes                                                                                                                                                                                                               |
| ------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0    | 2026-04-06 | Aziza  | Initial PRD created                                                                                                                                                                                                   |
| v1.1    | 2026-04-06 | Aziza  | Backend updated to Node.js + Express + TypeScript + Prisma; Tailwind CSS confirmed                                                                                                                                    |
| v1.2    | 2026-04-07 | Aziza  | SEO support added: dynamic meta tags, Open Graph, Twitter Cards, JSON-LD structured data, canonical URLs, hreflang, sitemap.xml, robots.txt, slug-based URLs, admin SEO metadata management, @vueuse/head integration |

```

```
