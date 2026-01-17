# Life-Task-Manager — Backend

This is the backend for the Life-Task-Manager application. It is an Express + TypeScript API that exposes CRUD endpoints for tasks and includes unit and integration tests (Jest + mongodb-memory-server).

Key features
- Express API with routes for creating, listing, updating and deleting tasks
- Mongoose models and services (Task model)
- Tests: unit (services) and integration (routes) using an in-memory MongoDB

Prerequisites
- Node.js 18+ and npm
- A running MongoDB instance for development (or use the in-memory server used by tests)

Quick start (development)
1. Install dependencies:
	npm i
2. Create a local env file at `backend/.env` (this file is ignored by git). Example values are in `backend/.env.example`.
	MONGO_URI=mongodb://localhost:27017/tasky_dev
	PORT=5000
3. Start the backend server:
	npm run dev

Run tests
- Run the full test suite (Jest):
  npm test

Important files
- `src/startServer.ts` — server startup and MongoDB connection
- `src/app.ts` — Express app and routes registration
- `src/models/Task.ts` — Mongoose model
- `src/services/*` — business logic for tasks
- `tests/` — unit and integration tests

Environment
- Do NOT commit real secret values to source control. Keep them in `backend/.env` and ensure `.gitignore` contains `.env`.

CI / Deployment notes
- Tests use `mongodb-memory-server` for CI-friendly integration testing. In production, set `MONGO_URI` to your managed MongoDB.

License
This project is open source (see LICENSE in the repository).

