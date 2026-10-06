\# Campus Equipment Booking API



A REST API for managing shared equipment reservations for a faculty.



The system allows users to view available equipment and create, read, update, and delete equipment bookings while preventing overlapping bookings for the same equipment.



\## Technology Stack



\- TypeScript

\- Hono

\- Cloudflare Workers

\- Cloudflare D1

\- SQLite



\## Project Structure



```text

midterm-api/

├── migrations/

│   └── 0001\_initial.sql

├── src/

│   └── index.ts

├── API\_CONTRACT.md

├── SCHEMA.md

├── TEST\_EVIDENCE.md

├── QUALITY\_GATE\_REVIEW.md

├── AI\_LOG.md

├── package.json

├── tsconfig.json

└── wrangler.jsonc

```



\## Database



The project uses Cloudflare D1 with two main tables:



\- `equipment`

\- `bookings`



The database is initialized using:



```text

migrations/0001\_initial.sql

```



The initial database contains two equipment records:



```text

eq-1 — Projector A — Building 1

eq-2 — Camera A — Media Room

```



See `SCHEMA.md` for the complete database schema and relationship.



\## API Base URL



When running locally:



```text

http://localhost:8787/api

```



\## API Endpoints



\### Equipment



| Method | Endpoint | Description |

|---|---|---|

| GET | `/equipment` | Get all equipment |



\### Bookings



| Method | Endpoint | Description |

|---|---|---|

| GET | `/bookings` | Get all bookings |

| GET | `/bookings/:id` | Get a booking by ID |

| POST | `/bookings` | Create a booking |

| PATCH | `/bookings/:id` | Update a booking |

| DELETE | `/bookings/:id` | Delete a booking |



See `API\_CONTRACT.md` for the complete API contract, request bodies, response formats, validation rules, and status codes.



\## Booking Rules



The API applies the following rules:



1\. All booking fields are required.

2\. `equipmentId` must refer to an existing equipment record.

3\. `startAt` and `endAt` must be valid dates.

4\. `startAt` must be before `endAt`.

5\. The same equipment cannot have overlapping bookings.

6\. The overlap rule applies to both creating and updating bookings.



\## HTTP Status Codes



| Status | Meaning |

|---|---|

| `200` | Successful GET or PATCH |

| `201` | Booking created |

| `204` | Booking deleted |

| `400` | Missing or invalid data |

| `404` | Resource not found |

| `409` | Booking time conflict |



All error responses use:



```json

{

&#x20; "error": "Error message"

}

```



\## Run Locally



Install dependencies:



```powershell

npm install

```



Apply the local D1 migration:



```powershell

npx wrangler d1 migrations apply campus-booking-db --local

```



Start the local development server:



```powershell

npm run dev

```



The API will be available at:



```text

http://localhost:8787/api

```



\## Testing



The API was tested locally using HTTP requests.



Test cases included:



\- Get equipment

\- Create booking

\- Get booking by ID

\- Update booking

\- Delete booking

\- Missing required field

\- Equipment not found

\- Overlapping booking during creation

\- Overlapping booking during update

\- Booking not found after deletion



The complete test results are documented in:



```text

TEST\_EVIDENCE.md

```



\## Quality Gate Review



The implementation was reviewed against the quality gate requirements, including:



\- API purpose and contract

\- Reliability

\- Booking overlap prevention

\- Equipment validation

\- HTTP status codes

\- SQL parameter binding

\- Testing and evidence

\- Reasoning and ownership



The review is documented in:



```text

QUALITY\_GATE\_REVIEW.md

```



\## AI Usage



AI was used as an assistance tool for:



\- API planning

\- Implementation guidance

\- Validation and overlap logic

\- Testing guidance

\- Documentation



The implementation was reviewed and tested locally, and important API behavior was verified before submission.



Details are documented in:



```text

AI\_LOG.md

```



\## Notes



This project is the individual practical lab implementation for the Platform Development midterm test.



The current implementation focuses on the required equipment booking API and does not include an additional browser client.

