# API Contract: Purchases & Bookings

**Date**: 2026-04-07

The purchase/booking flow is two-phase: (1) create a pending Purchase (checkout
initiation), (2) payment webhook confirms payment and creates the Booking record.

---

## POST /api/v1/purchases

Initiate checkout for a schedule slot.

**Auth required**: Yes — `CUSTOMER`

**Request body**:
```json
{
  "scheduleId": "cuid"
}
```

**Validation**:
- Schedule must exist and be active
- Schedule must have available seats (`availableSeats > 0`)
- User must not have an existing CONFIRMED booking for the same schedule

**Response 201**:
```json
{
  "purchaseId": "cuid",
  "amount": "2500.00",
  "currency": "SAR",
  "status": "PENDING",
  "paymentIntent": "<gateway_client_secret_or_equivalent>"
}
```

**Error responses**:
- `409` — schedule fully booked
- `409` — user already has a confirmed booking for this schedule

---

## POST /api/v1/purchases/webhook

Payment gateway webhook — updates Purchase status and creates Booking on success.

**Auth required**: No (secured by webhook signature verification)

**Request body**: Gateway-specific event payload

**Logic**:
- On success event: set `Purchase.status = PAID`, create `Booking` with generated
  `reference`, emit confirmation response.
- On failure event: set `Purchase.status = FAILED`.

**Response 200**: `{ "received": true }`

---

## GET /api/v1/bookings

List the authenticated customer's bookings.

**Auth required**: Yes — `CUSTOMER`

**Response 200**:
```json
{
  "data": [
    {
      "id": "cuid",
      "reference": "BK-20260407-0001",
      "status": "CONFIRMED",
      "courseNameAr": "التحضير لاختبار PMP",
      "courseNameEn": "PMP Exam Preparation",
      "scheduleStartDate": "2026-05-01T09:00:00Z",
      "scheduleEndDate": "2026-05-05T17:00:00Z",
      "amount": "2500.00",
      "currency": "SAR",
      "createdAt": "2026-04-07T12:00:00Z"
    }
  ],
  "total": 1
}
```

---

## GET /api/v1/bookings/:reference

Get a single booking by reference number.

**Auth required**: Yes — `CUSTOMER` (own bookings only) or `ADMIN`

**Response 200**: Single booking object (full detail)

**Error responses**:
- `403` — customer trying to access another user's booking
- `404` — booking not found

---

## GET /api/v1/admin/bookings

List all bookings (admin view).

**Auth required**: Yes — `ADMIN`

**Query params**:
- `scheduleId`: string (optional)
- `status`: `PENDING` | `CONFIRMED` | `CANCELLED` (optional)
- `page`, `limit`

**Response 200**: Paginated bookings with user and course info.

---

## DELETE /api/v1/admin/bookings/:id

Cancel a booking (admin action).

**Auth required**: Yes — `ADMIN`

**Response 200**:
```json
{ "status": "CANCELLED" }
```
