# API Contract: Categories

**Base path**: `/api/v1/programs/:programSlug/categories`
**Date**: 2026-04-07

Public GET endpoints are Redis-cached (TTL 5 min).

---

## GET /api/v1/programs/:programSlug/categories

List all active categories within a program.

**Auth required**: No
**Cache**: `cache:list:categories:<programSlug>`

**Response 200**:
```json
{
  "data": [
    {
      "id": "cuid",
      "programId": "cuid",
      "nameAr": "إدارة الجودة",
      "nameEn": "Quality Management",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "updatedAt": "2026-04-07T00:00:00Z",
      "courseCount": 4
    }
  ],
  "total": 1
}
```

**Error responses**:
- `404` — program not found

---

## GET /api/v1/programs/:programSlug/categories/:id

Get a single category by ID.

**Auth required**: No
**Cache**: `cache:entity:category:<id>`

**Response 200**: Single category object with `courses` array (basic info, no schedules)

---

## POST /api/v1/programs/:programSlug/categories

Create a category under a program.

**Auth required**: Yes — `ADMIN`

**Request body**:
```json
{
  "nameAr": "إدارة الجودة",
  "nameEn": "Quality Management",
  "descriptionAr": "...",
  "descriptionEn": "..."
}
```

**Response 201**: Created category object
**Side effect**: invalidates `cache:list:categories:<programSlug>`

---

## PUT /api/v1/programs/:programSlug/categories/:id

Update a category.

**Auth required**: Yes — `ADMIN`

**Response 200**: Updated category object
**Side effect**: invalidates list + entity cache

---

## DELETE /api/v1/programs/:programSlug/categories/:id

Delete a category (cascades to courses and schedules).

**Auth required**: Yes — `ADMIN`

**Query param**: `confirm=true` required if category has active bookings in
its courses (otherwise returns `409` with a warning payload).

**Response 204**: No content
