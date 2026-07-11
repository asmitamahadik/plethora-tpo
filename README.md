# Plethora — Training & Placement Management System

A role-based Training & Placement portal built to remove manual coordination between students, the TPO office, and recruiters. Students browse and apply to placement drives, TPO admins run the process and set eligibility, and companies post drives and manage candidates — with notifications and a full audit trail for traceability.

- **Backend**: Spring Boot 3 (Java 21), Spring Security + JWT, Spring Data JPA, MySQL
- **Frontend**: React 18 (Vite) + Ant Design 5
- **Roles**: Student, TPO Admin, Company

## Prerequisites

- Java 21
- Node 18+ (tested on Node 22.11)
- A running local MySQL server

No global Maven install is needed — the backend ships with the Maven wrapper (`./mvnw`).

## 1. Database setup

Create the database and, ideally, a dedicated app user (don't use `root` in anything beyond local dev):

```sql
CREATE DATABASE IF NOT EXISTS plethora_tpo;
CREATE USER IF NOT EXISTS 'plethora'@'localhost' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON plethora_tpo.* TO 'plethora'@'localhost';
FLUSH PRIVILEGES;
```

(You can also just point the app at an existing user — see `backend/src/main/resources/application.yml`. `DB_USERNAME`/`DB_PASSWORD` env vars override the defaults.)

## 2. Run the backend

```bash
cd backend
DB_USERNAME=plethora DB_PASSWORD=change-me ./mvnw spring-boot:run
```

The API listens on `http://localhost:8080`. On first boot it seeds a default TPO admin account:

- email: `admin@plethora.local`
- password: `Admin@123`

Override these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars. Also configurable: `JWT_SECRET`, `JWT_EXPIRATION_MS`, `CORS_ALLOWED_ORIGINS`.

Schema is created/updated automatically via Hibernate (`ddl-auto: update`) — no manual migrations needed for local dev.

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173` and talks to the backend at `http://localhost:8080/api` by default (override with `VITE_API_BASE_URL`).

## Golden path to try it out

1. Go to `/register`, create a **Company** account and a **Student** account (use two different browsers/incognito windows, or log out between steps).
2. Log in as the seeded **TPO Admin** (`admin@plethora.local` / `Admin@123`).
3. From **Manage Drives**, create a new drive for the company you registered, set eligibility (min CGPA, allowed departments, max backlogs), then **Publish** it — eligible students get notified automatically.
4. Log in as the **Student** — the drive appears under **Placement Drives** if they meet the eligibility criteria. Apply.
5. Log in as **TPO Admin** (or the **Company**) — open **Applicants** on the drive and move the application through `SHORTLISTED` → `INTERVIEW_SCHEDULED` → `SELECTED`/`REJECTED`. The student gets a notification on every change.
6. Check **Audit Log** (TPO Admin only) — every drive/eligibility/status change is recorded with actor, action, and timestamp.

## Project structure

```
plethora-tpo/
  backend/    Spring Boot REST API (com.plethora.tpo)
  frontend/   React + Ant Design SPA
```

See `backend/src/main/java/com/plethora/tpo/` for `entity/`, `repository/`, `service/`, `controller/`, `security/`, and `dto/` packages. See `frontend/src/` for `api/` (backend client), `auth/` (JWT session + route guards), `pages/{student,admin,company,shared}/`, and `components/`.
