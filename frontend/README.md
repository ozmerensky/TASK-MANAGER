# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
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

    Build
    - Production build:
      npm run build

    Important files
    - `src/` — React source code and components
    - `cypress/` — fixtures and e2e tests
    - `vite.config.ts` — Vite configuration
    - `cypress.config.ts` — Cypress config

    Environment
    - If you need environment variables, add them locally and avoid committing secrets. Use a safe `frontend/.env.example` if needed.

    Notes
    - The frontend includes an AI mock suggestion feature used by Cypress tests (no external AI calls).
