# Frontend Web Application - Wiki to Neo4j

This React app lets users submit a Wikipedia URL or Topic, tracks the extraction job status, and displays a simple graph visualization or error details. It communicates with the backend via REST API using HTTP Basic Auth.

## Features

- Submit input (`url` or `topic`, at least one required)
- Start a job and receive `jobId`
- Poll job status until `completed` or `failed`
- Fetch and show graph data on completion (basic placeholder list of nodes/edges)
- Fetch and show error details on failure or on demand
- Centralized API client with Basic Auth (env-configured)
- Basic responsive layout and loading states

## Prerequisites

- Node.js 16+ and npm

## Setup

1. Copy `.env.example` to `.env` and set your values:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_API_BASIC_USER=your_api_username
   REACT_APP_API_BASIC_PASS=your_api_password
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

Open http://localhost:3000 in your browser.

## API Integration

The app uses the following endpoints (HTTP Basic Auth required):

- POST `/api/input` → `{ jobId }`
- GET `/api/status/{jobId}` → `{ jobId, status, progress?, message? }`
- GET `/api/graph/{jobId}` → `{ nodes: [], edges: [] }` (on completed)
- GET `/api/errors/{jobId}` → `{ error, details? }`

Unauthorized (401), Not Found (404), and Server Errors (500) are handled with user-friendly messages.

## Project Structure

- `src/api/client.ts` — Axios client with Basic Auth and typed API calls.
- `src/components/InputForm.tsx` — Input form with validation.
- `src/components/StatusPanel.tsx` — Status display and polling controls.
- `src/components/GraphView.tsx` — Placeholder visualization.
- `src/pages/Home.tsx` — Main page tying everything together.
- `src/utils/validators.ts` — Validation helpers.
- `src/styles.css` — Basic responsive styling.
- `src/App.tsx`, `src/index.tsx` — App entry and routing.

## Notes

- This project is based on Create React App; environment variables must be prefixed with `REACT_APP_`.
- If you change `.env`, restart `npm start` to apply changes.
- The graph component is a placeholder; integrate a real graph library (e.g., d3/vis/force-graph) in the future.

## Scripts

- `npm start` — Run dev server at port 3000
- `npm run build` — Create production build
- `npm test` — Run tests (if any)

## Security

- Credentials are read from `.env` at build time and used only to set the Authorization header.
- Avoid committing real credentials to version control. Use `.env` for local dev and secure secrets in deployments.
