# Life-Task-Manager — Frontend

This is the frontend for the Life-Task-Manager application. It is a React + TypeScript app built with Vite and includes Cypress end-to-end tests.

    Quick start (development)
    1. Install dependencies:
       cd frontend
       npm i
    2. Start the Vite dev server:
       npm run dev
    3. Open the app in your browser at http://localhost:5173

    API
    - The frontend expects the backend to run at http://localhost:5000 and exposes endpoints under `/tasks`. You can configure the backend base URL in `src/services/taskService.ts`.

    Tests
    - Cypress E2E tests live in `frontend/cypress`. Run them:
      npx cypress open   # interactive
      npx cypress run    # headless
      
    Important files
    - `src/` — React source code and components
    - `cypress/` — fixtures and e2e tests
    - `vite.config.ts` — Vite configuration
    - `cypress.config.ts` — Cypress config

    Environment
    - If you need environment variables, add them locally and avoid committing secrets. Use a safe `frontend/.env.example` if needed.

    Notes
    - The frontend includes an AI mock suggestion feature used by Cypress tests (no external AI calls).
