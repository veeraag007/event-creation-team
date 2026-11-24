# Community 360 – Event Creation

Raagavan S — Event Details, User Account & My Events (Event Creation Team)

Current submission: organizer welcome page, admin registration, PostgreSQL persistence, Community 360 ID generation, admin login and temporary dashboard handoff. Attendee authentication, organization onboarding, Event Details, My Events and team integration are pending.

## Local setup

Requirements: Java 21, Node.js compatible with Next.js 16, npm and PostgreSQL.

1. Create the `community360` database in pgAdmin. Open its Query Tool and execute `backend/database/setup.sql`.
2. Open a terminal in `backend`. Set `DB_USER` and `DB_PASSWORD` in the terminal environment using your local PostgreSQL credentials. The application uses localhost:5432 and creates the admin table during startup.
3. Run `./mvnw spring-boot:run` (Windows PowerShell: `.\mvnw.cmd spring-boot:run`). The API runs on port 8080.
4. Open another terminal in `frontend`. Run `npm ci` and `npm run dev -- --port 3001` (Windows PowerShell: use `npm.cmd`).
5. Visit http://localhost:3001. Register an admin, copy their Community 360 ID, and proceed to login.

The current registration UI calls the Spring Boot API directly. The earlier Next.js SQLite route is retained from the submitted source as a prototype; the active registration flow uses PostgreSQL. Local database files and credentials are excluded. The dashboard is a temporary integration screen, and the current authentication flow is intended for local development.
