# API Contract: Programs

**Base path**: `/api/v1/programs`
**Date**: 2026-04-07

Public GET endpoints are Redis-cached (TTL 5 min). Cache invalidated on any write.

---

## GET /api/v1/programs

List all active programs.

**Auth required**: No
**Cache**: `cache:list:programs`

**Query params**:
- `lang` (optional): `ar` | `en` — default derived from `Accept-Language` header

**Response 200**:
```json
{
  "data": [
    {
      "id": "cuid",
      "slug": "project-management",
      "nameAr": "إدارة المشاريع",
      "nameEn": "Project Management",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "seoTitleAr": "...",
      "seoTitleEn": "...",
      "seoDescAr": "...",
      "seoDescEn": "...",
      "updatedAt": "2026-04-07T00:00:00Z",
      "categoryCount": 3
    }
  ],
  "total": 1
}
```

---

## GET /api/v1/programs/:slug

Get a single program by slug.

**Auth required**: No
**Cache**: `cache:entity:program:<slug>`

**Response 200**: Single program object (same shape as list item, plus `categories` array)

**Error responses**:
- `404` — program not found (or check `SlugRedirect` → 301 if found)

---

## POST /api/v1/programs

Create a new program.

**Auth required**: Yes — `ADMIN` or `SUPER_ADMIN`

**Request body**:
```json
{
  "slug": "project-management",
  "nameAr": "إدارة المشاريع",
  "nameEn": "Project Management",
  "descriptionAr": "...",
  "descriptionEn": "...",
  "seoTitleAr": "إدارة المشاريع | ماجد للتدريب",
  "seoTitleEn": "Project Management | MA Training",
  "seoDescAr": "...",
  "seoDescEn": "...",
  "seoKeywordsAr": "...",
  "seoKeywordsEn": "..."
}
```

**Validation**: all bilingual text fields required; slug unique; seoTitle max 60; seoDesc max 160

**Response 201**: Created program object
**Side effect**: invalidates `cache:list:programs`; invalidates `cache:sitemap`

---

## PUT /api/v1/programs/:id

Update an existing program.

**Auth required**: Yes — `ADMIN` or `SUPER_ADMIN`

**Request body**: same as POST (all fields)

**Slug change handling**: if slug changed, creates `SlugRedirect` record, invalidates
old cache key, sets new cache key.

**Response 200**: Updated program object
**Side effect**: invalidates list cache + entity cache + sitemap cache

---

## DELETE /api/v1/programs/:id

Delete a program and cascade to categories, courses, schedules.

**Auth required**: Yes — `ADMIN` or `SUPER_ADMIN`

**Response 204**: No content
**Side effect**: invalidates all related caches

---

## GET /api/v1/admin/slugs/check

Check slug uniqueness (used by admin SEO panel).

**Auth required**: Yes — `ADMIN`

**Query params**:
- `slug`: string (required)
- `type`: `program` | `course` (required)
- `excludeId`: string (optional — exclude current entity when editing)

**Response 200**:
```json
{ "available": true }
```
or
```json
{ "available": false, "conflict": "project-management" }
```
