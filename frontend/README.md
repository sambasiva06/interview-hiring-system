# HiringSystem Frontend

A minimal React client for the Interview Hiring System.

## Features
- **Job Board**: View all open jobs and apply.
- **Authentication**: Register and Login as Candidate, Recruiter, or Interviewer.
- **Application Tracking**: Candidates can view their application status.

## Tech Stack
- **React (JavaScript)**: Functional components with hooks.
- **Vite**: Ultra-fast build tool and dev server.
- **Axios**: Promised-based HTTP client.
- **Vanilla CSS**: Clean, custom styling.

## Getting Started

### Prerequisites
- Node.js & npm

### Installation
```bash
cd frontend
npm install
```

### Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`. 
It is configured to proxy requests to the backend at `http://localhost:8080`.

## Architecture
- `src/App.jsx`: Main entry point with simple conditional routing.
- `src/services/api.js`: Centralized API service using Axios.
- `src/pages/`: Contains functional pages (Home, Login, Register, MyApplications).
- `src/components/`: Reusable components (Navbar).
