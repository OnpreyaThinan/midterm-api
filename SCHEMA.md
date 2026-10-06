# Database Schema

## Overview

The system uses two main tables:

- `equipment` stores shared equipment information.
- `bookings` stores equipment reservations.

## ERD

```text
equipment
---------
id (PK)
name
location
    |
    | 1
    |
    | N
bookings
---------
id (PK)
equipment_id (FK)
borrower_name
start_at
end_at
purpose
```

## Table: equipment

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | Primary Key | Unique equipment ID |
| `name` | TEXT | NOT NULL | Equipment name |
| `location` | TEXT | NOT NULL | Equipment location |

### Example records

| id | name | location |
|---|---|---|
| `eq-1` | Projector A | Building 1 |
| `eq-2` | Camera A | Media Room |

## Table: bookings

| Column | Type | Constraint | Description |
|---|---|---|---|
| `id` | TEXT | Primary Key | Unique booking ID |
| `equipment_id` | TEXT | NOT NULL, Foreign Key | ID of the reserved equipment |
| `borrower_name` | TEXT | NOT NULL | Name of the borrower |
| `start_at` | TEXT | NOT NULL | Booking start time |
| `end_at` | TEXT | NOT NULL | Booking end time |
| `purpose` | TEXT | NOT NULL | Purpose of the booking |

## Relationship

One equipment item can have many bookings.

```text
equipment (1) -------- (N) bookings
       id                  equipment_id
```

The `bookings.equipment_id` field references `equipment.id`.

## Business Rules

1. `equipmentId` must refer to an existing equipment record.
2. `startAt` must be before `endAt`.
3. A booking must have all required fields.
4. The same equipment cannot have overlapping booking times.
5. The overlap rule applies to both creating and updating bookings.

## Overlap Rule

Two bookings conflict when they use the same equipment and their time ranges overlap.

The SQL condition used by the API is:

```sql
equipment_id = ?
AND start_at < ?
AND end_at > ?
```

For updating a booking, the current booking itself is excluded:

```sql
AND id != ?
```

This allows a booking to be updated without incorrectly conflicting with itself.

## Index

The database includes an index to support equipment and time-range queries:

```sql
CREATE INDEX idx_bookings_equipment_time
ON bookings (equipment_id, start_at, end_at);
```