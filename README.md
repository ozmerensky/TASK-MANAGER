# Life-Task-Manager — Full Stack Guide

A full-stack task management application built with **React + TypeScript** (frontend), **Express + TypeScript** (backend), and **MongoDB**.

This guide covers setup, local development, tests, and Dockerized execution in a single place.

## License

MIT License (see LICENSE in this repository)

## Repository Structure

| Folder / File         | Description                                        |
|-----------------------|----------------------------------------------------|
| backend/              | Express + TypeScript API for task management       |
| frontend/             | React + TypeScript SPA for user interface          |
| docker-compose.yml    | Docker Compose configuration for local development |


## Technical Decisions & Strategy

- **Dockerized Infrastructure:** I containerized the entire stack (Frontend, Backend, and MongoDB 6) using **Docker Compose**. This ensures **environment parity** between local development and CI, effectively eliminating "it works on my machine" issues and ensuring a deterministic system state.

- **Modern Frontend with Vite:** I opted for **Vite + TypeScript** over traditional tools to leverage its lightning-fast HMR (Hot Module Replacement) and optimized build process, significantly improving developer velocity.

- **Layered Testing Strategy (Integration over Unit):** For the backend, I prioritized **Integration Testing** (Service & API layers) over isolated Unit tests. Using **Jest** and **Supertest**, I validated the actual communication between routes, controllers, and services to ensure the "Contract" between layers remains intact, providing high confidence in the entire stack.

- **In-Memory Database for CI Efficiency:** I integrated `mongodb-memory-server` within the Jest lifecycle. This provides a **truly isolated and ephemeral database instance** for each test suite, preventing state leakage and ensuring a high-speed, reliable feedback loop in the CI pipeline.

- **Scalable E2E with POM & API Seeding:** I implemented the **Page Object Model (POM)** pattern in Cypress to decouple test logic from UI selectors, improving maintainability. Additionally, I leveraged **API Seeding** to prepare deterministic, predictable data states before each test, ensuring test independence from UI creation logic and improving test reliability.

- **Smart Synchronization & Resilience:** I replaced fragile, time-based waits with **Cypress Aliases and Intercepts**. By combining these with Cypress's automatic waiting mechanism, I ensured the tests are resilient to network fluctuations and asynchronous state changes.

- **Strict Port Isolation:** To maintain **system determinism**, I enforced a strict policy of isolating the Dockerized environment from local development servers, preventing port conflicts (5000/5173) and ensuring clean, stateless test executions.


## Quick Start (Local Development)

Clone the repository:

```bash
git clone https://github.com/ozmerensky/TASK-MANAGER.git
cd TASK-MANAGER
```

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   npm install
   ```

2. Create a local .env file (backend/.env), example values:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tasky_dev
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   API_PREFIX=/tasks
   ```

3. Start the backend server:

   ```bash
   npm run dev
   ```

4. Run tests:

   ```bash
   npm test
   ```

### Important Backend Files

- `src/startServer.ts` — server startup and MongoDB connection
- `src/app.ts` — Express app and routes registration
- `src/models/Task.ts` — Mongoose model
- `src/services/*` — business logic for tasks
- `tests/` — unit and integration tests

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:

   ```bash
   npm run dev
   ```

3. Open the app in your browser: http://localhost:5173

### API

The frontend expects the backend to run at http://localhost:5000.  
All endpoints are available under /tasks.  

*Backend Base URL:* You can configure the backend base URL in src/services/taskService.ts.  
This allows you to point the frontend to a different backend instance if needed (e.g., for staging or production environments).

### Tests

Cypress E2E tests:

Interactive mode:

```bash
npx cypress open
```

Headless mode:

```bash
npx cypress run
```

### Important Frontend Files

- `src/` — React components and source code
- `cypress/` — fixtures and end-to-end tests
- `vite.config.ts` — Vite configuration
- `cypress.config.ts` — Cypress configuration

---

## Running with Docker Compose

You can run the entire app (frontend + backend + MongoDB) locally with Docker Compose:

1. **Build and start all services:**
   ```bash
   docker compose up --build
   ```

2. **Stop and remove containers:**
   ```bash
   docker compose down
   ```

3. **View logs:**
   ```bash
   docker compose logs -f
   ```

4. **Show running containers:**
   ```bash
   docker compose ps
   ```

## Environment & CI

- Keep secrets in `.env` files — do not commit them to version control.
- CI pipelines run tests automatically to ensure code quality.
- Backend tests use `mongodb-memory-server` for fast, CI-friendly integration testing.
- E2E tests run against a dedicated MongoDB 6 container.

## AI Workflow Detail:
  Utilized AI to brainstorm the communication contract between React and Express, ensuring type safety across the stack. I leveraged AI-driven insights to generate comprehensive Cypress test scenarios and optimize Docker configurations, ensuring environment parity and a streamlined development-to-CI pipeline.

## Port Mapping & Environment Isolation

| Service | Local Development (`npm run dev`) | Docker Compose |
| :--- | :--- | :--- |
| **Frontend** | `5173` | `3000` |
| **Backend** | `5000` | `5000` |
| **MongoDB** | `27017` | `27017` |

> **Note:** Do not run local development servers (`npm run dev`) while Docker Compose is running, as they share the Backend (`5000`) and MongoDB (`27017`) ports, which will cause port conflicts.