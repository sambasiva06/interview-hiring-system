# Frontend API Contract

This document lists the backend endpoints consumed by the React frontend.

## Authentication

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "email": "user@example.com", "password": "password" }
  ```
- **Response Body**:
  ```json
  { "userId": 1, "name": "John", "email": "user@example.com", "role": "CANDIDATE" }
  ```
- **Role**: Public

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "name": "John", "email": "user@example.com", "password": "password", "role": "CANDIDATE" }
  ```
- **Response Body**:
  ```json
  { "id": 1, "username": "John", "email": "user@example.com", "role": "CANDIDATE" }
  ```
- **Role**: Public

---

## Job Management

### List Open Jobs
- **URL**: `/jobs`
- **Method**: `GET`
- **Response Body**:
  ```json
  [{ "id": 1, "title": "Java Dev", "description": "...", "location": "Remote", "status": "OPEN", "createdAt": "...", "recruiterName": "Admin" }]
  ```
- **Role**: Any authenticated user

### Create Job
- **URL**: `/jobs?recruiterId={id}`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "title": "...", "description": "...", "location": "..." }
  ```
- **Role**: `RECRUITER`, `ADMIN`

---

## Job Applications

### Apply to Job
- **URL**: `/jobs/{jobId}/apply?candidateId={id}`
- **Method**: `POST`
- **Response Body**: `JobApplicationResponse`
- **Role**: `CANDIDATE`

### View My Applications
- **URL**: `/applications/me?candidateId={id}`
- **Method**: `GET`
- **Response Body**: `List<JobApplicationResponse>`
- **Role**: `CANDIDATE`

### View Applications for Job
- **URL**: `/jobs/{jobId}/applications?requesterId={id}`
- **Method**: `GET`
- **Response Body**: `List<JobApplicationResponse>`
- **Role**: `RECRUITER` (creator), `ADMIN`

---

## Interviews

### Schedule Interview
- **URL**: `/interviews?recruiterId={id}`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "applicationId": 1, "interviewerId": 2, "scheduledAt": "2024-12-31T10:00:00" }
  ```
- **Role**: `RECRUITER`, `ADMIN`

### Update Interview Status
- **URL**: `/interviews/{id}/status?status=COMPLETED`
- **Method**: `PATCH`
- **Role**: `RECRUITER`, `INTERVIEWER`, `ADMIN`

---

## Evaluations

### Submit Evaluation
- **URL**: `/evaluations?interviewerId={id}`
- **Method**: `POST`
- **Request Body**:
  ```json
  { "interviewId": 1, "technicalScore": 8, "communicationScore": 7, "problemSolvingScore": 9, "comments": "..." }
  ```
- **Role**: `INTERVIEWER`
