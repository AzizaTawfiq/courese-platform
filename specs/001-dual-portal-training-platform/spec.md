# Feature Specification: Dual-Portal Corporate Training Platform

**Feature Branch**: `001-dual-portal-training-platform`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "Build a dual-portal corporate training web application
where companies can discover, browse, purchase, and book certified training courses
online — replacing the current manual process of phone calls, emails, and PDF catalogs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Discover & Browse the Training Catalog (Priority: P1)

Any visitor (anonymous or logged in) can explore the full training catalog through a
three-level hierarchy: Training Programs → Categories → Courses. Each level has a
dedicated page with descriptive content, and navigation between levels is intuitive.

**Why this priority**: Catalog discoverability is the platform's primary acquisition
mechanism. Without it, no registrations or bookings occur. It also drives organic
search traffic via SEO.

**Independent Test**: A user with no account can open the platform, navigate from the
landing page to a Program, then to a Category, then to a Course detail page, and read
all course information — delivering immediate value (catalog awareness) without any
registration.

**Acceptance Scenarios**:

1. **Given** a visitor is on the landing page, **When** they click on a featured
   Training Program, **Then** they see the Program detail page with its name,
   description, and list of Categories in their current language (AR or EN).

2. **Given** a visitor is on a Program page, **When** they click on a Category,
   **Then** they see the Category page listing all Courses within it.

3. **Given** a visitor is on a Category page, **When** they click on a Course,
   **Then** they see the full Course detail page including title, description,
   available schedule dates, duration, and a call-to-action to purchase or book.

4. **Given** a visitor is browsing in Arabic, **When** they switch to English,
   **Then** all page content, navigation, and layout direction update instantly
   without a page reload.

5. **Given** a visitor on any public page, **When** the page loads, **Then** the
   browser tab shows a unique page title and the page has a unique meta description
   reflecting that specific Program, Category, or Course.

---

### User Story 2 — Download the Training Schedule File (Priority: P2)

Any visitor on the landing page can download the full training schedule file by
clicking a prominently displayed banner image — no registration required.

**Why this priority**: The downloadable schedule is a key driver of initial engagement
and replicates the most-used function from the old process (emailing PDFs). It must
work for anonymous visitors.

**Independent Test**: A visitor with no account can open the landing page and
successfully download the schedule file via the banner, without any login prompt.

**Acceptance Scenarios**:

1. **Given** a visitor is on the landing page, **When** they click the schedule banner
   image, **Then** the schedule file downloads immediately to their device.

2. **Given** an admin has uploaded a new schedule file, **When** any visitor next
   clicks the banner, **Then** they download the updated file.

3. **Given** no schedule file has been uploaded yet, **When** a visitor clicks the
   banner, **Then** the banner is either hidden or shows a message that the schedule
   is not yet available.

---

### User Story 3 — Customer Registration & Account Setup (Priority: P3)

Company HR managers and training coordinators register for an individual account
by providing their name, company name, business email, and a password. After
registration they can log in to access purchase and booking features.

**Why this priority**: Registration unlocks purchasing and booking. It is the gateway
between anonymous browsing and transactional use of the platform.

**Independent Test**: A new user can register and log in to see their personal
dashboard — with no prior data in the system — as a standalone deliverable.

**Acceptance Scenarios**:

1. **Given** a visitor on the registration page, **When** they submit a valid company
   name, full name, email, and password, **Then** their account is created and they
   are directed to their dashboard.

2. **Given** a user attempts to register with an email already in use, **When** they
   submit the form, **Then** they see a clear error message indicating the email is
   already registered.

3. **Given** a registered customer, **When** they log in with valid credentials,
   **Then** they are taken to their personal dashboard showing booking history and
   available actions.

4. **Given** a customer attempts to log in with incorrect credentials, **When** they
   submit, **Then** they see an appropriate error message without revealing which
   field is wrong.

---

### User Story 4 — Purchase and Book a Course (Priority: P4)

A logged-in customer can select a Course, choose an available schedule slot, pay
for it online, and receive confirmation of their booking.

**Why this priority**: This is the core transactional flow — the primary business
outcome that replaces manual phone/email bookings. All prior stories build toward
this moment.

**Independent Test**: A logged-in customer with no prior bookings can select a course,
choose a schedule slot, complete payment, and view a confirmed booking in their
dashboard as a fully testable journey.

**Acceptance Scenarios**:

1. **Given** a logged-in customer on a Course detail page, **When** they click the
   booking CTA, **Then** they see available schedule slots with dates, times, and
   seat availability.

2. **Given** a customer has selected a schedule slot, **When** they proceed to
   checkout and complete payment, **Then** they receive an on-screen booking
   confirmation with a unique booking reference number.

3. **Given** a customer has completed a booking, **When** they view their dashboard,
   **Then** their booking appears in history with status, course name, and schedule
   date.

4. **Given** a customer attempts to book a schedule slot that is fully occupied,
   **When** they reach the booking step, **Then** they see a clear "Fully Booked"
   indicator and cannot proceed with that slot.

5. **Given** a customer is not logged in and clicks the booking CTA, **When** they
   interact with it, **Then** they are prompted to log in or register before
   proceeding.

---

### User Story 5 — Admin Manages Content (Priority: P5)

Platform administrators can create, edit, and delete Training Programs, Categories,
Courses, and Schedules through a secure Admin Portal. Changes are reflected
immediately on the customer-facing site.

**Why this priority**: Content management is the operational backbone of the platform.
Without it, admins cannot build or maintain the catalog that customers browse.

**Independent Test**: An admin can log in, create a new Training Program with a
Category and one Course, add a schedule to that course, and verify the course appears
on the customer-facing catalog — deliverable as a standalone admin workflow.

**Acceptance Scenarios**:

1. **Given** an admin on the Programs management page, **When** they create a new
   Program with AR and EN names and descriptions, **Then** the program appears in
   the customer catalog in both languages.

2. **Given** an admin editing an existing Course, **When** they update the AR or EN
   description and save, **Then** the course detail page on the customer portal
   immediately reflects the updated content.

3. **Given** an admin on the Schedules management page, **When** they add a new
   schedule slot (date, time, capacity) to a Course, **Then** customers can see and
   book that slot.

4. **Given** an admin deletes a Course, **When** the deletion is confirmed, **Then**
   the course no longer appears in the customer catalog.

5. **Given** an admin deletes a Schedule slot that has existing bookings, **When**
   they attempt deletion, **Then** the system warns them of active bookings and
   requires explicit confirmation before deleting.

---

### User Story 6 — Admin Manages SEO Metadata (Priority: P6)

Administrators can set and update SEO metadata — title, meta description, and URL
slug — for every Program and Course through the Admin Portal. A live SERP preview
shows how the content will appear in search engine results.

**Why this priority**: SEO metadata quality directly drives organic discoverability.
Real-time visual feedback ensures quality without requiring external SEO tools.

**Independent Test**: An admin can open a Course's SEO panel, update the SEO title
and description in both languages, preview the SERP rendering, and save — verifiable
as a standalone workflow with no dependency on purchase or booking features.

**Acceptance Scenarios**:

1. **Given** an admin editing a Program or Course, **When** they open the SEO panel,
   **Then** they see input fields for SEO title (AR + EN), meta description (AR + EN),
   and URL slug, each with real-time character counters.

2. **Given** an admin types an SEO title exceeding 60 characters, **When** the limit
   is crossed, **Then** the counter turns red and a validation warning appears.

3. **Given** an admin types a meta description exceeding 160 characters, **When** the
   limit is crossed, **Then** the counter turns red and a validation warning appears.

4. **Given** an admin is editing the SEO panel, **When** they type in any field,
   **Then** a SERP preview updates live showing title (≤60 chars), the URL with the
   current slug, and description (≤160 chars).

5. **Given** an admin enters a slug already used by another entity of the same type,
   **When** they finish typing (after a short pause), **Then** an inline error appears
   and the save button is disabled until the slug is unique.

---

### User Story 7 — Admin Uploads the Schedule File (Priority: P7)

Administrators can upload a new training schedule file via the Admin Portal, which
replaces the file available for download on the customer landing page.

**Why this priority**: The downloadable schedule is frequently updated. Admins need a
simple upload mechanism to keep it current without developer involvement.

**Independent Test**: An admin can upload a new file and verify that the customer
landing page download now returns the new file — testable as a standalone workflow.

**Acceptance Scenarios**:

1. **Given** an admin on the schedule upload page, **When** they upload a valid file
   and confirm, **Then** the admin interface confirms success and shows the upload
   date.

2. **Given** a file has been successfully uploaded, **When** a visitor clicks the
   landing page banner, **Then** the downloaded file matches the newly uploaded one.

3. **Given** an admin uploads a file in an unsupported format, **When** they submit,
   **Then** they see a clear error message listing the accepted file formats.

---

### Edge Cases

- What happens when a Program is deleted that still has active Categories and Courses?
  The system must warn the admin of cascading deletions and require explicit confirmation.
- What if a Course has no active schedule slots? The course remains browsable but the
  booking CTA changes to a "No Upcoming Dates" message.
- What if a user's session expires mid-booking? They are redirected to login and then
  returned to the booking flow after re-authentication.
- What if both AR and EN fields are required but only one is filled? The form must not
  allow saving — both AR and EN fields are mandatory for all content entities.
- What if the sitemap is requested when the database has no published content? A valid,
  minimal `sitemap.xml` is returned with only root-level URLs.

## Requirements *(mandatory)*

### Functional Requirements

**Visitor / Public Access**

- **FR-001**: Any visitor MUST be able to browse the full Training Program → Category →
  Course hierarchy without registering or logging in.
- **FR-002**: Any visitor MUST be able to download the training schedule file from the
  landing page by clicking the featured banner image, without authentication.
- **FR-003**: Any visitor MUST be able to switch between Arabic and English instantly
  without a page reload; the layout direction MUST change accordingly (RTL for Arabic,
  LTR for English).
- **FR-004**: Every public page (landing, programs, categories, courses) MUST have a
  unique page title, unique meta description, canonical URL, Open Graph tags, hreflang
  alternate links for AR and EN, and JSON-LD structured data.
- **FR-005**: The platform MUST expose an auto-generated `sitemap.xml` covering all
  public content pages, updated on every content change.
- **FR-006**: The platform MUST serve a `robots.txt` that allows crawling of public
  pages and explicitly disallows crawling of admin and authentication pages.
- **FR-007**: All public content pages MUST be accessible via slug-based, human-readable
  URLs. Numeric IDs MUST NOT appear in public URLs.

**Customer Registration & Authentication**

- **FR-008**: Visitors MUST be able to register an account by providing their full name,
  company name, business email address, and a password.
- **FR-009**: The system MUST prevent duplicate registrations using the same email
  address.
- **FR-010**: Registered customers MUST be able to log in with their email and password
  and log out at any time.
- **FR-011**: Customers MUST be able to view their booking history on a personal
  dashboard.

**Customer Purchasing & Booking**

- **FR-012**: A logged-in customer MUST be able to select a Course, view available
  schedule slots, and initiate a booking for a chosen slot.
- **FR-013**: The system MUST prevent customers from booking a schedule slot that has
  reached its maximum seat capacity.
- **FR-014**: Upon successful payment and booking confirmation, the customer MUST see
  an on-screen confirmation with a unique booking reference number.
- **FR-015**: Completed bookings MUST appear in the customer's dashboard with status,
  course name, and scheduled date.

**Admin Portal — Content Management**

- **FR-016**: Administrators MUST be able to create, edit, and delete Training Programs,
  with Arabic and English name and description fields required for each.
- **FR-017**: Administrators MUST be able to create, edit, and delete Categories under
  a Training Program, with Arabic and English fields required.
- **FR-018**: Administrators MUST be able to create, edit, and delete Courses under a
  Category, with Arabic and English name and description fields required.
- **FR-019**: Administrators MUST be able to add, edit, and delete Schedule slots
  (date, time, capacity) for each Course.
- **FR-020**: The system MUST warn administrators before deleting any entity that
  cascades to child records or affects active bookings, requiring explicit confirmation.

**Admin Portal — Schedule File**

- **FR-021**: Administrators MUST be able to upload a training schedule file (PDF,
  XLS, or XLSX). The uploaded file becomes immediately available for download on
  the customer landing page.

**Admin Portal — SEO Management**

- **FR-022**: Administrators MUST be able to set and update the SEO title, meta
  description, and URL slug for every Training Program and Course in both Arabic and
  English.
- **FR-023**: The SEO panel MUST display a live SERP preview updating as the admin
  types, showing title, URL, and description as they would appear in search results.
- **FR-024**: The system MUST validate SEO titles to a maximum of 60 characters and
  meta descriptions to a maximum of 160 characters, with real-time character counters.
- **FR-025**: The system MUST validate URL slug uniqueness in real time (debounced).
  Duplicate slugs MUST block saving.
- **FR-026**: Slug values MUST follow the pattern of lowercase alphanumeric words
  separated by hyphens (e.g., `intro-to-project-management`).

### Key Entities

- **Training Program**: Top-level content grouping. Has bilingual name, description,
  and SEO metadata (title AR/EN, description AR/EN, slug). Contains Categories.
- **Category**: Mid-level grouping within a Program. Has bilingual name and description.
  Contains Courses.
- **Course**: Purchasable/bookable unit. Has bilingual name, description, duration,
  price, and SEO metadata (title AR/EN, description AR/EN, slug). Contains Schedules.
- **Schedule**: A specific occurrence of a Course with date, time, and seat capacity.
- **Customer Account**: Individual user record with full name, company name, email,
  and password.
- **Booking**: Links a Customer to a Schedule. Carries booking reference, payment
  status, and timestamp.
- **Schedule File**: A file asset uploaded by admins and served via the landing page
  banner download.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Any visitor can navigate from the landing page to a specific Course
  detail page in 3 clicks or fewer.
- **SC-002**: A new customer can complete registration and make their first booking
  in under 5 minutes from first visit.
- **SC-003**: Language switching between Arabic and English completes in under 0.5
  seconds with no full page reload, with all content and layout direction updated.
- **SC-004**: Every public page passes an automated SEO audit with a score of 90 or
  above (meta tags, title uniqueness, canonical, hreflang, Open Graph, JSON-LD all
  present and valid).
- **SC-005**: Within 90 days of launch, all new bookings originate through the
  self-service digital portal — zero bookings processed via phone or email.
- **SC-006**: An admin can publish new content (Program, Category, Course, and Schedule)
  and have it appear live on the customer portal within 2 minutes of saving.
- **SC-007**: An admin can complete a full SEO metadata update for a Course, including
  SERP preview review and slug validation, in under 3 minutes.
- **SC-008**: The schedule file download is accessible to anonymous visitors with a
  single click on the landing page banner — no additional steps required.

## Assumptions

- Each customer registers an individual account with their company details. Multi-user
  company accounts (shared dashboard, seat allocation across employees) are out of
  scope for this version.
- Payment is processed online through a third-party payment provider. The spec covers
  the user journey (select → checkout → confirm); the specific payment gateway is an
  implementation decision for the planning phase.
- Accepted file types for the schedule file upload are PDF, XLS, and XLSX.
- The Admin Portal is accessible only to pre-created administrator accounts. There is
  no self-service admin registration — admin accounts are provisioned by the system
  owner.
- Saving a Program, Category, or Course makes it immediately visible on the customer
  portal. A draft/publish workflow is not included in this version.
- JSON-LD structured data type used for Courses is `schema.org/Course`; breadcrumb
  navigation uses `schema.org/BreadcrumbList`.
- Slug auto-generation derives from the English name of the entity. Admins may override
  the generated slug manually.
- Slug changes trigger a server-side 301 redirect from the old slug to the new one,
  preserving SEO equity.
- The platform targets modern evergreen browsers (Chrome, Firefox, Safari, Edge).
  Internet Explorer is out of scope.
