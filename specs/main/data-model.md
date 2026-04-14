# Data Model: Dual-Portal Corporate Training Platform

**Phase**: 1 — Design
**Date**: 2026-04-07
**Branch**: `001-dual-portal-training-platform`

---

## Entity Relationship Overview

```
User (Customer/Admin)
  └── Bookings ──── Schedule
                       └── Course ──── Category ──── Program
                                          └── SlugRedirect (per entity type)
ScheduleFile (singleton-ish, latest upload wins)
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum Role {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

enum PurchaseStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// ─── User ─────────────────────────────────────────────────────────────────────

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  fullName     String
  companyName  String
  role         Role      @default(CUSTOMER)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  bookings     Booking[]
  purchases    Purchase[]

  @@map("users")
}

// ─── RefreshToken ─────────────────────────────────────────────────────────────
// Tracks valid refresh tokens for rotation / revocation

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique   // SHA-256 of the raw token
  expiresAt DateTime
  createdAt DateTime @default(now())
  revoked   Boolean  @default(false)

  @@index([userId])
  @@map("refresh_tokens")
}

// ─── Program ──────────────────────────────────────────────────────────────────

model Program {
  id             String     @id @default(cuid())
  slug           String     @unique
  nameAr         String
  nameEn         String
  descriptionAr  String     @db.Text
  descriptionEn  String     @db.Text
  seoTitleAr     String     @db.VarChar(60)
  seoTitleEn     String     @db.VarChar(60)
  seoDescAr      String     @db.VarChar(160)
  seoDescEn      String     @db.VarChar(160)
  seoKeywordsAr  String?
  seoKeywordsEn  String?
  isActive       Boolean    @default(true)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  categories     Category[]

  @@map("programs")
}

// ─── Category ─────────────────────────────────────────────────────────────────

model Category {
  id            String   @id @default(cuid())
  programId     String
  program       Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  nameAr        String
  nameEn        String
  descriptionAr String   @db.Text
  descriptionEn String   @db.Text
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  courses       Course[]

  @@map("categories")
}

// ─── Course ───────────────────────────────────────────────────────────────────

model Course {
  id             String     @id @default(cuid())
  categoryId     String
  category       Category   @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  slug           String     @unique
  nameAr         String
  nameEn         String
  descriptionAr  String     @db.Text
  descriptionEn  String     @db.Text
  durationHours  Int
  price          Decimal    @db.Decimal(10, 2)
  currency       String     @default("SAR")
  seoTitleAr     String     @db.VarChar(60)
  seoTitleEn     String     @db.VarChar(60)
  seoDescAr      String     @db.VarChar(160)
  seoDescEn      String     @db.VarChar(160)
  seoKeywordsAr  String?
  seoKeywordsEn  String?
  isActive       Boolean    @default(true)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  schedules      Schedule[]

  @@map("courses")
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

model Schedule {
  id           String    @id @default(cuid())
  courseId     String
  course       Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  startDate    DateTime
  endDate      DateTime
  location     String?
  maxCapacity  Int
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  bookings     Booking[]
  purchases    Purchase[]

  @@map("schedules")
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

model Purchase {
  id              String         @id @default(cuid())
  userId          String
  user            User           @relation(fields: [userId], references: [id])
  scheduleId      String
  schedule        Schedule       @relation(fields: [scheduleId], references: [id])
  amount          Decimal        @db.Decimal(10, 2)
  currency        String         @default("SAR")
  status          PurchaseStatus @default(PENDING)
  paymentRef      String?        // Gateway payment reference
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  booking         Booking?

  @@map("purchases")
}

// ─── Booking ──────────────────────────────────────────────────────────────────

model Booking {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  scheduleId  String
  schedule    Schedule      @relation(fields: [scheduleId], references: [id])
  purchaseId  String        @unique
  purchase    Purchase      @relation(fields: [purchaseId], references: [id])
  reference   String        @unique  // Human-readable e.g. BK-20260407-0001
  status      BookingStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("bookings")
}

// ─── ScheduleFile ─────────────────────────────────────────────────────────────

model ScheduleFile {
  id           String   @id @default(cuid())
  filename     String
  originalName String
  mimeType     String
  fileUrl      String
  uploadedBy   String   // Admin user ID
  createdAt    DateTime @default(now())

  @@map("schedule_files")
}

// ─── SlugRedirect ─────────────────────────────────────────────────────────────

model SlugRedirect {
  id          String   @id @default(cuid())
  oldSlug     String
  newSlug     String
  entityType  String   // "program" | "course"
  entityId    String
  createdAt   DateTime @default(now())

  @@unique([oldSlug, entityType])
  @@map("slug_redirects")
}
```

---

## Entity Descriptions

### User
Represents both customers (HR managers / training coordinators) and administrators.
Role field controls portal access. Customers register via the public registration form;
admins are provisioned by a seed script or SUPER_ADMIN API endpoint.

### RefreshToken
Tracks issued refresh tokens for rotation. The raw token is never stored — only its
SHA-256 hash, allowing fast lookup. Revoked tokens are kept for audit purposes.

### Program
Top-level content grouping. Has bilingual names, descriptions, and full SEO metadata
(title, description, keywords in both AR and EN). Slug is unique across all Programs.
`isActive` controls visibility in the customer catalog.

### Category
Mid-level grouping within a Program. Has bilingual name and description. `onDelete:
Cascade` means deleting a Program removes all its Categories (and their Courses and
Schedules) — enforced by the admin confirmation warning.

### Course
Purchasable/bookable unit under a Category. Has all SEO fields, price with currency,
and duration. Slug is unique across all Courses. `isActive` controls catalog visibility.

### Schedule
A specific time-bound occurrence of a Course with capacity. Multiple Schedules can
exist for one Course. When a Schedule's booking count equals `maxCapacity`, it shows
as "Fully Booked".

**Derived field** (not stored): `availableSeats = maxCapacity - confirmed booking count`

### Purchase
Records the payment intent/result linking a User to a Schedule. Created when checkout
is initiated (status `PENDING`). Updated to `PAID` by payment webhook. A `Booking` is
created only after status reaches `PAID`.

### Booking
Created upon confirmed payment. The `reference` field is the human-readable booking
ID shown to the customer (format: `BK-YYYYMMDD-NNNN`). References the Purchase for
payment traceability.

### ScheduleFile
Stores metadata about uploaded schedule files. The latest uploaded file (by `createdAt`
DESC) is the one served at the public download endpoint.

### SlugRedirect
Tracks slug renames for SEO-preserving 301 redirects. Keyed on `(oldSlug, entityType)`
to prevent duplicate entries.

---

## Key Validation Rules (Zod Constraints)

| Field | Rule |
|---|---|
| `seoTitleAr`, `seoTitleEn` | `z.string().max(60)` |
| `seoDescAr`, `seoDescEn` | `z.string().max(160)` |
| `slug` | `z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)` |
| `email` | `z.string().email()` |
| `password` | `z.string().min(8)` |
| `maxCapacity` | `z.number().int().positive()` |
| `price` | `z.number().nonnegative()` |
| `durationHours` | `z.number().int().positive()` |
| `startDate` / `endDate` | `z.coerce.date()` — endDate must be after startDate |

---

## State Transitions

### BookingStatus
```
PENDING → CONFIRMED (on payment webhook success)
PENDING → CANCELLED (on payment failure or user cancellation)
CONFIRMED → CANCELLED (on admin cancellation with confirmation)
```

### PurchaseStatus
```
PENDING → PAID (payment webhook: success event)
PENDING → FAILED (payment webhook: failure event)
PAID → REFUNDED (admin action — future scope)
```
