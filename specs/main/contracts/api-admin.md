# API Contract: Admin — Schedule File & SEO Utilities

**Date**: 2026-04-07

---

## POST /api/v1/admin/schedule-file

Upload a new training schedule file.

**Auth required**: Yes — `ADMIN`

**Request**: `multipart/form-data`
- `file`: binary — accepted MIME types:
  - `application/pdf`
  - `application/vnd.ms-excel`
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Max size: 10 MB

**Response 201**:
```json
{
  "id": "cuid",
  "filename": "schedule-2026-q2.pdf",
  "originalName": "Training Schedule Q2 2026.pdf",
  "fileUrl": "/uploads/schedule-files/schedule-2026-q2.pdf",
  "createdAt": "2026-04-07T12:00:00Z"
}
```

**Error responses**:
- `400` — no file provided
- `415` — unsupported file type
- `413` — file exceeds 10 MB

---

## GET /api/v1/schedule-file/download

Download the latest training schedule file (public — no auth required).

**Auth required**: No

**Response**: `302` redirect to the file URL

**Error responses**:
- `404` — no schedule file has been uploaded yet

---

## GET /api/v1/admin/schedule-file

Get metadata about the currently uploaded schedule file.

**Auth required**: Yes — `ADMIN`

**Response 200**:
```json
{
  "id": "cuid",
  "originalName": "Training Schedule Q2 2026.pdf",
  "fileUrl": "/uploads/schedule-files/schedule-2026-q2.pdf",
  "createdAt": "2026-04-07T12:00:00Z"
}
```

---

## GET /sitemap.xml

Generate (or serve cached) the XML sitemap.

**Auth required**: No
**Cache**: Redis key `cache:sitemap` — TTL 1 hour; invalidated on any admin CRUD write

**Response 200**: `Content-Type: application/xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://domain.com/</loc>
    <lastmod>2026-04-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="https://domain.com/ar/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://domain.com/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://domain.com/en/"/>
  </url>
  <!-- ... one <url> per program, category, and course -->
</urlset>
```

---

## GET /robots.txt

Static file served by Express.

**Auth required**: No

**Response**:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /customer/
Disallow: /login
Disallow: /register
Disallow: /api/

Sitemap: https://domain.com/sitemap.xml
```

---

## GET /api/v1/admin/slugs/check

Validate slug uniqueness in real time (used by admin SEO panel with debounce).

**Auth required**: Yes — `ADMIN`

**Query params**:
- `slug`: string (required)
- `type`: `program` | `course` (required)
- `excludeId`: string (optional — exclude current entity when editing)

**Response 200**:
```json
{ "available": true }
```

or:
```json
{ "available": false }
```
