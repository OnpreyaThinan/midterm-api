\# Test Evidence



\## Base URL



```text

http://localhost:8787/api

```



\## Test Summary



The API was tested locally using HTTP requests.



| No. | Test Case | Method | Expected Status | Result |

|---|---|---|---:|---|

| 1 | List equipment | GET `/api/equipment` | 200 | PASS |

| 2 | Create booking | POST `/api/bookings` | 201 | PASS |

| 3 | Get booking by ID | GET `/api/bookings/:id` | 200 | PASS |

| 4 | Update booking | PATCH `/api/bookings/:id` | 200 | PASS |

| 5 | Delete booking | DELETE `/api/bookings/:id` | 204 | PASS |

| 6 | Missing required field | POST `/api/bookings` | 400 | PASS |

| 7 | Equipment not found | POST `/api/bookings` | 404 | PASS |

| 8 | Overlapping booking | POST `/api/bookings` | 409 | PASS |

| 9 | Overlapping update | PATCH `/api/bookings/:id` | 409 | PASS |

| 10 | Deleted booking not found | GET `/api/bookings/:id` | 404 | PASS |



\## 1. List Equipment



\*\*Request\*\*



```text

GET http://localhost:8787/api/equipment

```



\*\*Expected:\*\* `200 OK`



\*\*Result\*\*



```json

\[

&#x20; {

&#x20;   "id": "eq-1",

&#x20;   "name": "Projector A",

&#x20;   "location": "Building 1"

&#x20; },

&#x20; {

&#x20;   "id": "eq-2",

&#x20;   "name": "Camera A",

&#x20;   "location": "Media Room"

&#x20; }

]

```



\*\*Status:\*\* PASS



\---



\## 2. Create Booking



\*\*Request\*\*



```text

POST http://localhost:8787/api/bookings

```



\*\*Request body\*\*



```json

{

&#x20; "equipmentId": "eq-1",

&#x20; "borrowerName": "Somchai Jaidee",

&#x20; "startAt": "2026-10-20T09:00:00.000Z",

&#x20; "endAt": "2026-10-20T11:00:00.000Z",

&#x20; "purpose": "Class presentation"

}

```



\*\*Expected:\*\* `201 Created`



\*\*Result\*\*



Booking was created successfully with ID:



```text

254d7faf-abba-49c6-b5e2-d2161cfb7482

```



\*\*Status:\*\* PASS



\---



\## 3. Get Booking by ID



\*\*Request\*\*



```text

GET http://localhost:8787/api/bookings/254d7faf-abba-49c6-b5e2-d2161cfb7482

```



\*\*Expected:\*\* `200 OK`



\*\*Result\*\*



```json

{

&#x20; "id": "254d7faf-abba-49c6-b5e2-d2161cfb7482",

&#x20; "equipmentId": "eq-1",

&#x20; "borrowerName": "Somchai Jaidee",

&#x20; "startAt": "2026-10-20T09:00:00.000Z",

&#x20; "endAt": "2026-10-20T11:00:00.000Z",

&#x20; "purpose": "Class presentation"

}

```



\*\*Status:\*\* PASS



\---



\## 4. Update Booking



The first booking was updated successfully.



\*\*Request\*\*



```text

PATCH http://localhost:8787/api/bookings/254d7faf-abba-49c6-b5e2-d2161cfb7482

```



\*\*Updated data\*\*



```json

{

&#x20; "equipmentId": "eq-1",

&#x20; "borrowerName": "Somchai Updated",

&#x20; "startAt": "2026-10-20T09:00:00.000Z",

&#x20; "endAt": "2026-10-20T10:30:00.000Z",

&#x20; "purpose": "Updated class presentation"

}

```



\*\*Expected:\*\* `200 OK`



\*\*Status:\*\* PASS



\---



\## 5. Create Overlapping Booking



A booking already existed for `eq-1` from `09:00` to `10:30`.



A second booking was attempted for the overlapping time period.



\*\*Expected:\*\* `409 Conflict`



\*\*Result\*\*



```json

{

&#x20; "error": "This equipment is already booked during this time."

}

```



\*\*Status:\*\* PASS



This confirms that the API prevents overlapping bookings for the same equipment.



\---



\## 6. Create Second Booking



A second non-overlapping booking was created successfully.



\*\*Request data\*\*



```json

{

&#x20; "equipmentId": "eq-1",

&#x20; "borrowerName": "Second Student",

&#x20; "startAt": "2026-10-20T13:00:00.000Z",

&#x20; "endAt": "2026-10-20T15:00:00.000Z",

&#x20; "purpose": "Second class"

}

```



\*\*Expected:\*\* `201 Created`



\*\*Result\*\*



Booking ID:



```text

e12477eb-8848-4e58-8808-8e34bf125913

```



\*\*Status:\*\* PASS



\---



\## 7. Update Booking to an Overlapping Time



The first booking was updated to overlap with the second booking.



\*\*Expected:\*\* `409 Conflict`



\*\*Result\*\*



```json

{

&#x20; "error": "This equipment is already booked during this time."

}

```



\*\*Status:\*\* PASS



This confirms that the overlap rule is also applied when updating an existing booking.



\---



\## 8. Delete Booking



The second booking was deleted successfully.



\*\*Request\*\*



```text

DELETE http://localhost:8787/api/bookings/e12477eb-8848-4e58-8808-8e34bf125913

```



\*\*Expected:\*\* `204 No Content`



\*\*Result:\*\* No response body was returned.



\*\*Status:\*\* PASS



\---



\## 9. Get Deleted Booking



After deletion, the deleted booking was requested again.



\*\*Request\*\*



```text

GET http://localhost:8787/api/bookings/e12477eb-8848-4e58-8808-8e34bf125913

```



\*\*Expected:\*\* `404 Not Found`



\*\*Result\*\*



```json

{

&#x20; "error": "Booking not found."

}

```



\*\*Status:\*\* PASS



\---



\## 10. Missing Required Field



A booking request was sent without the `purpose` field.



\*\*Expected:\*\* `400 Bad Request`



\*\*Result\*\*



```json

{

&#x20; "error": "All booking fields are required."

}

```



\*\*Status:\*\* PASS



This confirms that required booking fields are validated.



\---



\## 11. Equipment Not Found



A booking request was sent using a non-existing equipment ID:



```text

eq-999

```



\*\*Expected:\*\* `404 Not Found`



\*\*Result\*\*



```json

{

&#x20; "error": "Equipment not found."

}

```



\*\*Status:\*\* PASS



This confirms that `equipmentId` is checked against existing equipment records.



\---



\## Test Conclusion



The Campus Equipment Booking API was tested locally and passed the required functional and error cases.



The tests covered:



\- Successful equipment retrieval

\- Successful booking creation

\- Successful booking retrieval

\- Successful booking update

\- Successful booking deletion

\- Missing required field validation

\- Equipment not found

\- Booking conflict during creation

\- Booking conflict during update

\- Booking not found after deletion



The overlap rule was verified for both creating and updating bookings.



All tested error responses used the required JSON format:



```json

{

&#x20; "error": "Error message"

}

```



\*\*Overall result: PASS\*\*

