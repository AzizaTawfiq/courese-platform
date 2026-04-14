# API Contract: Schedules

**Base path**: `/api/v1/admin/schedules`
**Date**: 2026-04-07

Schedule creation and management is admin-only. Public schedule data is served
via the Course detail endpoint (`GET /api/v1/courses/:slug`).

---

## POST /api/v1/admin/schedules

Add a schedule slot to a course.

**Auth required**: Yes — `ADMIN`

**Request body**:
```json
{
  "courseId": "cuid",
  "startDate": "2026-05-01T09:00:00Z",
  "endDate": "2026-05-05T17:00:00Z",
  "location": "Riyadh",
  "maxCapacity": 20
}
```

**Validation**:
- `endDate` must be after `startDate`
- `maxCapacity` must be a positive integer

**Response 201**: Created schedule object
**Side effect**: invalidates `cache:entity:course:<slug>` (derived from courseId)

---

## PUT /api/v1/admin/schedules/:id

Update a schedule slot.

**Auth required**: Yes — `ADMIN`

**Request body**: same as POST (partial update not supported — send full object)

**Constraint**: Cannot reduce `maxCapacity` below current confirmed booking count.
Returns `422` if attempted.

**Response 200**: Updated schedule object
**Side effect**: invalidates course entity cache

---

## DELETE /api/v1/admin/schedules/:id

Delete a schedule slot.

**Auth required**: Yes — `ADMIN`

**Query param**: `confirm=true` required if schedule has confirmed bookings.
Without it, returns `409`:
```json
{
  "warning": "Schedule has 5 confirmed booking(s). Pass confirm=true to proceed.",
  "bookingCount": 5
}
```

**Response 204**: No content
**Side effect**: invalidates course entity cache

---

## GET /api/v1/admin/schedules

List all schedules (admin view with booking counts).

**Auth required**: Yes — `ADMIN`

**Query params**:
- `courseId`: string (optional filter)
- `from`: ISO date (optional)
- `to`: ISO date (optional)

**Response 200**:
```json
{
  "data": [
    {
      "id": "cuid",
      "courseId": "cuid",
      "courseNameEn": "PMP Exam Preparation",
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
