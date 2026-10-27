IMAS — API Specification

Project: Intern Management & Attendance System
API version: v1
Base path: "/api/v1"
Document status: Proposed API contract for frontend and backend implementtation

1. API conventions

- All request and response bodies use JSON unless otherwise stated.
- Successful responses use "{ "status": "success", "data": ... }" where applicable.
- List endpoints return "data" as an array. Use ".map()" to render the records.
- Single-resource endpoints return "data" as an object.
- Resource IDs are UUID strings.
- Dates use "YYYY-MM-DD"; timestamps use ISO 8601 UTC format.
- DELETE endpoints receive resource IDs through URL parameters, not request bodies.
- Passwords and PINs are submitted in request bodies but are never returned in API responses.

2. Roles and permissions

Feature| Administrator| Supervisor| Intern Coordinator
View dashboard| Yes| Yes| Yes
Manage staff| Yes| No| No
Create and update interns| Yes| Yes| Yes
Deactivate interns| Yes| Yes| No
Set/reset intern PINs| Yes| Yes| Yes
Record attendance| Yes| No| Yes
View attendance| Yes| Yes| Yes
Correct/delete attendance| Yes| No| No
Manage projects and assignments| Yes| Yes| No

Authentication and password recovery endpoints are available as appropriate to the authentication flow. All other endpoints require an authenticated staff member with the necessary role.

3. Authentication endpoints

POST "/auth/login"

Request body

{
"email": "admin@imas.com",
"password": "TestPassword123"
}

POST "/auth/logout"

Request body: None.

GET "/auth/me"

Response body

{
"status": "success",
"data": {
"id": "staff-uuid",
"fullName": "Jane Doe",
"email": "jane@example.com",
"role": "ADMINISTRATOR",
"status": "ACTIVE"
}
}

POST "/auth/forgot-password"

Request body

{
"email": "admin@imas.com"
}

POST "/auth/reset-password"

Request body

{
"token": "reset-token",
"newPassword": "NewPassword123",
"confirmPassword": "NewPassword123"
}

4. Staff endpoints

GET "/staff"

Response body

{
"status": "success",
"data": [
{
"id": "staff-uuid",
"fullName": "Jane Doe",
"email": "jane@example.com",
"role": "SUPERVISOR",
"status": "ACTIVE",
"createdAt": "2026-10-01T09:00:00.000Z"
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

GET "/staff/:id"

Response body

{
"status": "success",
"data": {
"id": "staff-uuid",
"fullName": "Jane Doe",
"email": "jane@example.com",
"role": "SUPERVISOR",
"status": "ACTIVE",
"createdAt": "2026-10-01T09:00:00.000Z",
"updatedAt": "2026-10-10T12:00:00.000Z"
}
}

POST "/staff"

Request body

{
"fullName": "Jane Doe",
"email": "jane@example.com",
"password": "TestPassword123",
"role": "SUPERVISOR"
}

PUT "/staff/:id"

Request body

{
"fullName": "Jane Doe",
"email": "jane.doe@example.com"
}

PATCH "/staff/:id/status"

Request body

{
"status": "INACTIVE"
}

PATCH "/staff/:id/role"

Request body

{
"role": "ADMINISTRATOR"
}

5. Intern endpoints

GET "/interns"

Response body

{
"status": "success",
"data": [
{
"id": "intern-uuid",
"fullName": "John Doe",
"phone": "08012345678",
"email": "john@example.com",
"group": "Group A",
"techArea": "Web Development",
"course": "Computer Science",
"skills": ["JavaScript", "React"],
"startDate": "2026-10-01",
"endDate": "2027-03-31",
"status": "ACTIVE"
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

GET "/interns/:id"

Response body

{
"status": "success",
"data": {
"id": "intern-uuid",
"fullName": "John Doe",
"phone": "08012345678",
"email": "john@example.com",
"group": "Group A",
"techArea": "Web Development",
"course": "Computer Science",
"skills": ["JavaScript", "React"],
"startDate": "2026-10-01",
"endDate": "2027-03-31",
"status": "ACTIVE",
"createdAt": "2026-10-01T09:00:00.000Z",
"updatedAt": "2026-10-01T09:00:00.000Z"
}
}

POST "/interns"

Request body

{
"fullName": "John Doe",
"phone": "08012345678",
"email": "john@example.com",
"group": "Group A",
"techArea": "Web Development",
"course": "Computer Science",
"skills": ["JavaScript", "React"],
"startDate": "2026-10-01",
"endDate": "2027-03-31"
}

PUT "/interns/:id"

Request body

{
"fullName": "John Doe",
"phone": "08012345678",
"email": "john@example.com",
"group": "Group A",
"techArea": "Web Development",
"course": "Computer Science",
"skills": ["JavaScript", "React", "Node.js"],
"startDate": "2026-10-01",
"endDate": "2027-03-31"
}

PATCH "/interns/:id/status"

Request body

{
"status": "INACTIVE"
}

PUT "/interns/:id/pin"

Request body

{
"pin": "1234"
}

This endpoint is for setting or resetting an intern's PIN. Store only a secure hash of the PIN.

POST "/interns/:id/verify-pin"

Request body

{
"pin": "1234"
}

Use this endpoint only if a separate PIN-verification operation is required. Otherwise, PIN verification can happen directly during sign-in and sign-out.

6. Attendance endpoints

GET "/attendance"

Response body

{
"status": "success",
"data": [
{
"id": "attendance-uuid",
"internId": "intern-uuid",
"internName": "John Doe",
"date": "2026-10-23",
"signInAt": "2026-10-23T08:05:00.000Z",
"signOutAt": "2026-10-23T16:00:00.000Z",
"recordedBy": {
"id": "staff-uuid",
"fullName": "Jane Doe"
}
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

GET "/attendance/:id"

Response body

{
"status": "success",
"data": {
"id": "attendance-uuid",
"internId": "intern-uuid",
"internName": "John Doe",
"date": "2026-10-23",
"signInAt": "2026-10-23T08:05:00.000Z",
"signOutAt": "2026-10-23T16:00:00.000Z",
"recordedBy": {
"id": "staff-uuid",
"fullName": "Jane Doe"
},
"createdAt": "2026-10-23T08:05:00.000Z",
"updatedAt": "2026-10-23T16:00:00.000Z"
}
}

GET "/interns/:id/attendance"

Response body

{
"status": "success",
"data": [
{
"id": "attendance-uuid",
"date": "2026-10-23",
"signInAt": "2026-10-23T08:05:00.000Z",
"signOutAt": "2026-10-23T16:00:00.000Z",
"recordedBy": {
"id": "staff-uuid",
"fullName": "Jane Doe"
}
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

POST "/attendance/sign-in"

Request body

{
"internId": "intern-uuid",
"pin": "1234"
}

POST "/attendance/sign-out"

Request body

{
"internId": "intern-uuid",
"pin": "1234"
}

PUT "/attendance/:id"

Request body

{
"date": "2026-10-23",
"signInAt": "2026-10-23T08:00:00.000Z",
"signOutAt": "2026-10-23T16:00:00.000Z"
}

Only an Administrator can correct an attendance record.

7. Project endpoints

GET "/projects"

Response body

{
"status": "success",
"data": [
{
"id": "project-uuid",
"name": "Website Development",
"description": "Develop the company website",
"status": "OPEN",
"department": "IT",
"techArea": "Web Development",
"internCount": 2,
"createdAt": "2026-10-01T09:00:00.000Z"
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

GET "/projects/:id"

Response body

{
"status": "success",
"data": {
"id": "project-uuid",
"name": "Website Development",
"description": "Develop the company website",
"status": "OPEN",
"department": "IT",
"techArea": "Web Development",
"internCount": 2,
"createdAt": "2026-10-01T09:00:00.000Z",
"updatedAt": "2026-10-10T12:00:00.000Z"
}
}

GET "/projects/:id/interns"

Response body

{
"status": "success",
"data": [
{
"id": "intern-uuid",
"fullName": "John Doe",
"techArea": "Web Development",
"status": "ACTIVE",
"assignedAt": "2026-10-05T10:00:00.000Z"
}
],
"meta": {
"page": 1,
"limit": 10,
"total": 1,
"totalPages": 1
}
}

POST "/projects"

Request body

{
"name": "Website Development",
"description": "Develop the company website",
"status": "OPEN",
"department": "IT",
"techArea": "Web Development"
}

PUT "/projects/:id"

Request body

{
"name": "Website Development",
"description": "Develop the company website",
"department": "IT",
"techArea": "Web Development"
}

PATCH "/projects/:id/status"

Request body

{
"status": "COMPLETED"
}

POST "/projects/:id/interns"

Request body

{
"internIds": ["intern-uuid-1", "intern-uuid-2"]
}

This assigns the specified interns to the project.

8. Dashboard endpoint

GET "/dashboard/summary"

Response body

{
"status": "success",
"data": {
"totalInterns": 45,
"activeInterns": 38,
"inactiveInterns": 7,
"presentToday": 30,
"signedOutToday": 20,
"currentlyPresent": 10,
"totalStaff": 8,
"activeProjects": 5
}
}

9. DELETE endpoints

DELETE requests do not require a request body. The ID is included in the URL.

Method and endpoint| Purpose| Permission
"DELETE /attendance/:id"| Delete an attendance record| Administrator
"DELETE /projects/:id/interns/:internId"| Remove an intern from a project| Administrator, Supervisor

Example: "DELETE /attendance/attendance-uuid"

Example: "DELETE /projects/project-uuid/interns/intern-uuid"

Staff and interns are deactivated through their status endpoints rather than permanently deleted.

10. Query parameters

List endpoints may support the following query parameters where relevant.

Parameter| Type| Purpose| Example
"page"| Integer| Page number| "?page=1"
"limit"| Integer| Records per page| "?limit=10"
"search"| String| Search by relevant text fields| "?search=John"
"status"| Enum| Filter by status| "?status=ACTIVE"
"role"| Enum| Filter staff by role| "?role=SUPERVISOR"
"startDate"| Date| Filter from a date| "?startDate=2026-10-01"
"endDate"| Date| Filter through a date| "?endDate=2026-10-31"
"internId"| UUID| Filter attendance by intern| "?internId=intern-uuid"
"projectId"| UUID| Filter by project where applicable| "?projectId=project-uuid"

Examples:

- "GET /interns?page=1&limit=10&search=John&status=ACTIVE"
- "GET /attendance?startDate=2026-10-01&endDate=2026-10-31"
- "GET /staff?role=SUPERVISOR&status=ACTIVE"

The backend should validate query parameters and return consistent pagination metadata for paginated lists.

11. Data types and allowed values

Common field types

Type| Format / example
ID| UUID string, e.g. ""intern-uuid""
String| ""John Doe""
Integer| "10"
Boolean| "true" or "false"
String array| "["JavaScript", "React"]"
Date| ""2026-10-01""
Timestamp| ""2026-10-23T08:05:00.000Z""
Nullable timestamp| "null" when not yet signed out

Allowed enum values

Staff roles

- "ADMINISTRATOR"
- "SUPERVISOR"
- "INTERN_COORDINATOR"

Staff and intern status

- "ACTIVE"
- "INACTIVE"

Project status

- "OPEN"
- "COMPLETED"
- "ABANDONED"
- "CANCELED"

Additional field rules

- "email": valid email address.
- "password": string meeting the agreed password policy.
- "pin": string of digits, with the PIN length defined consistently by the backend.
- "skills": array of strings.
- "startDate" and "endDate": valid dates; "endDate" must not precede "startDate".
- "page" and "limit": positive integers.
- "signOutAt": nullable when the intern has not signed out.

12. Error response format

All API errors should use a consistent structure.

Example: validation error — HTTP 400

{
"status": "error",
"message": "Validation failed",
"errors": [
{
"field": "email",
"message": "A valid email address is required"
}
]
}

Example: unauthorized — HTTP 401

{
"status": "error",
"message": "Authentication required"
}

Example: forbidden — HTTP 403

{
"status": "error",
"message": "You do not have permission to perform this action"
}

Example: resource not found — HTTP 404

{
"status": "error",
"message": "Intern not found"
}

Example: business-rule conflict — HTTP 409

{
"status": "error",
"message": "This intern is already signed in"
}

Example: server error — HTTP 500

{
"status": "error",
"message": "An unexpected error occurred"
}

The frontend should use the "message" field to show a useful error to the user and the "errors" array to display field-specific validation feedback when provided. Server errors must not expose passwords, PIN hashes, reset tokens, stack traces, or sensitive internal details.

13. Business rules to enforce

- Only active staff with the appropriate role can perform protected actions.
- Inactive interns cannot record attendance.
- Sign-in and sign-out must verify the intern's PIN.
- An intern cannot sign in twice without signing out first.
- An intern cannot sign out without an active sign-in record.
- Supervisors can view attendance but cannot correct or delete records.
- Only Administrators can correct or delete attendance records.
- Interns do not have staff accounts or self-service dashboards.
- PINs and passwords must be hashed securely before storage.

14. Implementation notes

1. Frontend and backend teams should use these request and response shapes as the shared contract.
1. Validate request bodies and query parameters on the backend.
1. Keep response field names and types consistent across endpoints.
1. Confirm any remaining business rules before implementation, especially PIN length, attendance timing rules, pagination defaults, and whether project assignments allow multiple projects per intern.
1. The examples use mock data for documentation and frontend development; they are not real records or credentials.
