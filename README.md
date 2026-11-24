# Community 360 – Event Creation

Raagavan S — Event Details, User Account & My Events (Event Creation Team)

Current submission: organizer welcome page, admin registration, PostgreSQL persistence, Community 360 ID generation, admin login and temporary dashboard handoff. The attendee account module adds registration, login, profile editing, password changes and logout, plus published event browsing and details. Organization onboarding, email verification, password recovery, real booking history and final team integration are pending.

## Local setup

Requirements: Java 21, Node.js compatible with Next.js 16, npm and PostgreSQL.

1. Create the `community360` database in pgAdmin. Open its Query Tool and execute `backend/database/setup.sql`.
2. Open a terminal in `backend`. Set `DB_USER` and `DB_PASSWORD` in the terminal environment using your local PostgreSQL credentials. The application uses localhost:5432 and creates the admin table during startup.
3. Run `./mvnw spring-boot:run` (Windows PowerShell: `.\mvnw.cmd spring-boot:run`). The API runs on port 8080.
4. Open another terminal in `frontend`. Run `npm ci` and `npm run dev -- --port 3001` (Windows PowerShell: use `npm.cmd`).
5. Visit http://localhost:3001. Register an admin, copy their Community 360 ID, and proceed to login.

The current registration UI calls the Spring Boot API directly. The earlier Next.js SQLite route is retained from the submitted source as a prototype; the active registration flow uses PostgreSQL. Local database files and credentials are excluded. The dashboard is a temporary integration screen, and the current authentication flow is intended for local development.

## Attendee module

- `/user-registration`, `/user-login` — attendee signup and sign-in with email/password.
- `/profile` — authenticated profile, name/phone updates and password change.
- `/explore`, `/events/[id]` — read published event information from the existing event-lifecycle API.
- `/my-events` — authenticated booking-history placeholder until the booking API contract is available.

Spring Boot creates the separate `attendees` table at startup. Use the same PostgreSQL configuration as the admin module. The API exposes `POST /api/attendee/register`, `POST /api/attendee/login`, `GET /api/attendee/me`, `PUT /api/attendee/me`, `POST /api/attendee/password` and `POST /api/attendee/logout`. The session cookie is required for authenticated operations; admin sessions cannot access attendee accounts.

Run the teammate's event lifecycle Spring Boot service separately on port 8081 (set `server.port=8081` in that service's local application configuration). Its existing `GET /api/events/published` and `GET /api/events/{id}` response formats are supported. To change the URL, set `NEXT_PUBLIC_EVENTS_API_URL` in the frontend environment and restart Next.js. The attendee account service defaults to port 8080 and may be configured using `NEXT_PUBLIC_API_URL`.

Local verification checklist: register a fresh attendee, reject a duplicate email, sign in with the correct password, reject an incorrect password, edit and reload the profile, change password and sign in again, sign out and confirm that the profile requires login. With the event service running, publish an event and open its details. Email ownership verification and production authentication protections are still required before public deployment.
