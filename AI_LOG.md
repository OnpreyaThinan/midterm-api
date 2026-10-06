\# AI Usage Log



\## Overview



AI was used as an assistance tool during the development of the Campus Equipment Booking API.



I reviewed and tested the AI-assisted work before using it and verified the API behavior through local HTTP requests.



\## AI Assistance Used



\### 1. API Planning and Design



AI was used to help understand the exam requirements and plan:



\- API routes and HTTP methods

\- Request and response structure

\- HTTP status codes

\- Booking validation rules

\- Equipment and booking data model

\- Database relationship between equipment and bookings



The final API contract and database schema were reviewed against the exam requirements before implementation.



\### 2. API Implementation



AI was used to assist with TypeScript and Hono implementation for:



\- GET `/api/equipment`

\- GET `/api/bookings`

\- GET `/api/bookings/:id`

\- POST `/api/bookings`

\- PATCH `/api/bookings/:id`

\- DELETE `/api/bookings/:id`



AI also helped with validation and SQL query structure.



I reviewed the implementation and verified the important business rules myself.



\### 3. Booking Conflict Logic



AI was used to help implement the overlap check for bookings.



The important SQL condition is:



```sql

equipment\_id = ?

AND start\_at < ?

AND end\_at > ?

```



For an update, the current booking is excluded with:



```sql

AND id != ?

```



I verified this behavior by testing both:



\- Creating an overlapping booking

\- Updating a booking into an overlapping time period



Both tests returned `409 Conflict` as expected.



\### 4. Testing



AI was used to help identify test cases required by the exam and testing guide.



The API was then tested locally using HTTP requests.



Tested cases included:



\- Successful equipment retrieval

\- Successful booking creation

\- Successful booking retrieval

\- Successful booking update

\- Successful booking deletion

\- Missing required field

\- Equipment not found

\- Booking conflict during creation

\- Booking conflict during update

\- Booking not found after deletion



The actual test results are recorded in `TEST\_EVIDENCE.md`.



\### 5. Documentation



AI was used to help structure and draft:



\- `API\_CONTRACT.md`

\- `SCHEMA.md`

\- `TEST\_EVIDENCE.md`

\- `QUALITY\_GATE\_REVIEW.md`

\- `AI\_LOG.md`



The documents were reviewed to ensure that they describe the actual implementation and test results.



\## Verification and Human Responsibility



I did not treat AI output as automatically correct.



I reviewed the generated suggestions, implemented the relevant changes, ran the application locally, and tested the API behavior.



I verified the following important areas:



1\. The API routes match the required contract.

2\. Required booking fields are validated.

3\. `equipmentId` is checked against the equipment table.

4\. `startAt` must be before `endAt`.

5\. The same equipment cannot have overlapping bookings.

6\. Overlap prevention works for both POST and PATCH.

7\. SQL queries use parameter binding with `.bind()`.

8\. The API returns the required HTTP status codes.

9\. Error responses use the required JSON format.

10\. CRUD operations were tested with actual HTTP requests.



\## Key Decisions I Understand



\### HTTP Status Codes



\- `200` — successful GET or PATCH

\- `201` — booking successfully created

\- `204` — booking successfully deleted

\- `400` — missing or invalid request data

\- `404` — equipment or booking not found

\- `409` — booking time conflict



\### Booking Overlap Rule



Two bookings conflict when they use the same equipment and their time ranges overlap.



The update operation excludes the current booking so that a booking does not conflict with itself.



\### Database Security



SQL parameters are passed using parameter binding instead of concatenating user input directly into SQL statements.



\## AI Limitations and Verification



AI assistance does not replace testing or understanding of the implementation.



The API was run locally and the important success and error cases were tested before submission.



Any AI-generated suggestion was checked against the exam requirements, API contract, database schema, and actual test results.



\## Final Statement



AI was used as an assistance tool for planning, implementation guidance, testing guidance, and documentation.



I remain responsible for the submitted implementation and can explain the API routes, validation rules, database schema, overlap logic, SQL parameter binding, HTTP status codes, and test results.

