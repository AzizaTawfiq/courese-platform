# API Contract: Courses

**Base path**: `/api/v1/courses` (public) + `/api/v1/admin/courses` (admin CRUD)
**Date**: 2026-04-07

---

## GET /api/v1/courses

List all active courses (optionally filtered by category).

**Auth required**: No
**Cache**: `cache:list:courses:<categoryId?>:<page>`

**Query params**:
- `categoryId`: string (optional)
- `programSlug`: string (optional)
- `page`: number (default 1)
- `limit`: number (default 20, max 50)

**Response 200**:
```json
{
  "data": [
    {
      "id": "cuid",
      "slug": "pmp-exam-prep",
      "categoryId": "cuid",
      "nameAr": "التحضير لاختبار PMP",
      "nameEn": "PMP Exam Preparation",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "durationHours": 40,
      "price": "2500.00",
      "currency": "SAR",
      "seoTitleAr": "...",
      "seoTitleEn": "...",
      "seoDescAr": "...",
      "seoDescEn": "...",
      "updatedAt": "2026-04-07T00:00:00Z",
      "upcomingScheduleCount": 2
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

---

## GET /api/v1/courses/:slug

Get a single course by slug with its active schedules.

**Auth required**: No
**Cache**: `cache:entity:course:<slug>`

**Response 200**: Course object plus `schedules` array:
```json
{
  "schedules": [
    {
      "id": "cuid",
      "startDate": "2026-05-01T09:00:00Z",
      "endDate": "2026-05-05T17:00:00Z",
      "location": "Riyadh",
      "maxCapacity": 20,
      "confirmedBookings": 12,
      "availableSeats": 8
    }
  ]
}
```

**Error responses**:
- `404` — course not found (check SlugRedirect → 301 if found)

---

## POST /api/v1/admin/courses

Create a course under a category.

**Auth required**: Yes — `ADMIN`

**Request body**:
```json
{
  "categoryId": "cuid",
  "slug": "pmp-exam-prep",
  "nameAr": "التحضير لاختبار PMP",
  "nameEn": "PMP Exam Preparation",
  "descriptionAr": "...",
  "descriptionEn": "...",
  "durationHours": 40,
  "price": 2500.00,
  "currency": "SAR",
  "seoTitleAr": "...",
  "seoTitleEn": "...",
  "seoDescAr": "...",
  "seoDescEn": "..."
}
```

**Response 201**: Created course object
**Side effect**: invalidates course list cache + sitemap cache

---

## PUT /api/v1/admin/courses/:id

Update a course.

**Auth required**: Yes — `ADMIN`

**Request body**: same as POST

**Slug change handling**: creates SlugRedirect if slug changed

**Response 200**: Updated course object
**Side effect**: invalidates list + entity + sitemap cache

---

## DELETE /api/v1/admin/courses/:id

Delete a course.

**Auth required**: Yes — `ADMIN`

**Query param**: `confirm=true` required if course has active bookings.
Without it, returns `409` with warning:
```json
{
  "warning": "This course has 3 active booking(s). Pass confirm=true to proceed."
}
```

**Response 204**: No content
