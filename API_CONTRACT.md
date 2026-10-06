# API Contract

## Base URL

```text
http://localhost:8787/api
```

## Equipment

### GET /equipment

Returns all available equipment.

**Success:** `200 OK`

Example response:

```json
[
  {
    "id": "eq-1",
    "name": "Projector A",
    "location": "Building 1"
  },
  {
    "id": "eq-2",
    "name": "Camera A",
    "location": "Media Room"
  }
]
```

## Bookings

### GET /bookings

Returns all bookings.

**Success:** `200 OK`

### GET /bookings/:id

Returns one booking by ID.

**Success:** `200 OK`

**Not found:** `404 Not Found`

```json
{
  "error": "Booking not found."
}
```

### POST /bookings

Creates a new booking.

**Request body:**

```json
{
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Class presentation"
}
```

**Success:** `201 Created`

**Validation error:** `400 Bad Request`

**Equipment not found:** `404 Not Found`

**Time conflict:** `409 Conflict`

### PATCH /bookings/:id

Updates an existing booking.

**Request body:**

```json
{
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Updated",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T10:30:00.000Z",
  "purpose": "Updated class presentation"
}
```

**Success:** `200 OK`

**Validation error:** `400 Bad Request`

**Booking or equipment not found:** `404 Not Found`

**Time conflict:** `409 Conflict`

### DELETE /bookings/:id

Deletes an existing booking.

**Success:** `204 No Content`

**Not found:** `404 Not Found`

## Booking Response

A successful booking response includes:

```json
{
  "id": "booking-id",
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Class presentation"
}
```

## Validation Rules

1. All booking fields are required.
2. `equipmentId` must refer to an existing equipment record.
3. `startAt` and `endAt` must be valid dates.
4. `startAt` must be before `endAt`.
5. The same equipment must not have overlapping bookings.
6. The overlap rule applies to both creating and updating bookings.

## Error Format

All errors use JSON:

```json
{
  "error": "Error message"
}
```

## Status Codes

| Status | Meaning |
|---|---|
| `200` | Successful GET or PATCH |
| `201` | Booking created |
| `204` | Booking deleted |
| `400` | Missing or invalid data |
| `404` | Resource not found |
| `409` | Booking time conflict |