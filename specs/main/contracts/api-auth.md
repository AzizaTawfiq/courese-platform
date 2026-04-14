# API Contract: Authentication

**Base path**: `/api/v1/auth`
**Date**: 2026-04-07

All auth endpoints are rate-limited (max 10 req/min per IP).

---

## POST /api/v1/auth/register

Register a new customer account.

**Auth required**: No

**Request body**:
```json
{
  "fullName": "Sara Al-Ahmad",
  "companyName": "Acme Corp",
  "email": "sara@acme.com",
  "password": "Str0ng!Pass"
}
```

**Validation (Zod)**:
- `fullName`: string, min 2
- `companyName`: string, min 2
- `email`: valid email, unique
- `password`: string, min 8

**Response 201**:
```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "cuid",
    "fullName": "Sara Al-Ahmad",
    "email": "sara@acme.com",
    "role": "CUSTOMER"
  }
}
```

**Sets cookie**: `__rt=<refresh_token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`

**Error responses**:
- `400` — validation failure (details in `errors` array)
- `409` — email already registered

---

## POST /api/v1/auth/login

Authenticate an existing user.

**Auth required**: No

**Request body**:
```json
{
  "email": "sara@acme.com",
  "password": "Str0ng!Pass"
}
```

**Response 200**:
```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "cuid",
    "fullName": "Sara Al-Ahmad",
    "email": "sara@acme.com",
    "role": "CUSTOMER"
  }
}
```

**Sets cookie**: `__rt` (same as register)

**Error responses**:
- `400` — validation failure
- `401` — invalid credentials (generic message, no field hint)

---

## POST /api/v1/auth/refresh

Exchange a valid refresh token cookie for a new access token. Issues a new refresh
token cookie (rotation).

**Auth required**: No — refresh token via `__rt` cookie (sent automatically)

**Request body**: empty

**Response 200**:
```json
{
  "accessToken": "<new_jwt>"
}
```

**Sets cookie**: new `__rt` value; old token revoked

**Error responses**:
- `401` — missing, expired, or revoked refresh token

---

## POST /api/v1/auth/logout

Revoke the current refresh token and clear the cookie.

**Auth required**: Yes (any role)

**Response 204**: No content

**Clears cookie**: `__rt`

---

## GET /api/v1/auth/me

Return the authenticated user's profile.

**Auth required**: Yes (any role)

**Response 200**:
```json
{
  "id": "cuid",
  "fullName": "Sara Al-Ahmad",
  "email": "sara@acme.com",
  "companyName": "Acme Corp",
  "role": "CUSTOMER"
}
```
