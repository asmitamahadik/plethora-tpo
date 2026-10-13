# Plethora: Training and Placement Management System

Originally built as my final year B.E. project at Sinhgad College of Engineering (2022 to 2023). The repository was re-published in October 2026 after the original was deleted.

A role-based Training and Placement portal that removes manual coordination between students, the TPO office and recruiters. Students browse and apply to placement drives, TPO admins run the process and set eligibility, and companies post drives and manage candidates. Every important change sends a notification and is recorded in an audit log.

## Features

- Three roles: Student, TPO Admin and Company
- JWT authentication with Spring Security and role-based access
- Placement drives with eligibility rules (minimum CGPA, allowed departments, maximum backlogs)
- Publishing a drive automatically notifies eligible students
- Application workflow: `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED` or `REJECTED`, with a notification to the student on every change
- Audit log (TPO Admin only) recording the actor, action and timestamp for every drive, eligibility and status change

## Tech stack

- **Backend:** Spring Boot 3 (Java 21), Spring Security with JWT, Spring Data JPA, MySQL
- **Frontend:** React 18 (Vite) and Ant Design 5

## Prerequisites

- Java 21
- Node 18 or later (tested on Node 22.11)
- A running local MySQL server

You don't need Maven installed. The backend includes the Maven wrapper (`./mvnw`).

## 1. Database setup

Create the database, and a dedicated app user instead of using `root`:

```sql
CREATE DATABASE IF NOT EXISTS plethora_tpo;
CREATE USER IF NOT EXISTS 'plethora'@'localhost' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON plethora_tpo.* TO 'plethora'@'localhost';
FLUSH PRIVILEGES;
```

You can also point the app at an existing user. See `backend/src/main/resources/application.yml`. The `DB_USERNAME` and `DB_PASSWORD` environment variables override the defaults.

## 2. Run the backend

```bash
cd backend
DB_USERNAME=plethora DB_PASSWORD=change-me ./mvnw spring-boot:run
```

The API runs at http://localhost:8080. On first start it creates a default TPO admin account:

- Email: `admin@plethora.local`
- Password: `Admin@123`

Change these with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Other settings you can configure: `JWT_SECRET`, `JWT_EXPIRATION_MS` and `CORS_ALLOWED_ORIGINS`.

The database schema is created and updated automatically by Hibernate (`ddl-auto: update`), so local development needs no manual migrations.

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at http://localhost:5173 and talks to the backend at `http://localhost:8080/api`. Set `VITE_API_BASE_URL` to change that.

## Try it out

1. Go to `/register` and create a **Company** account and a **Student** account. Use two different browsers or private windows, or log out between steps.
2. Log in as the default **TPO Admin**.
3. Open **Manage Drives**, create a drive for the company, set the eligibility rules and click **Publish**. Eligible students are notified automatically.
4. Log in as the **Student**. The drive appears under **Placement Drives** if they meet the criteria. Apply to it.
5. Log in as the **TPO Admin** or the **Company**, open **Applicants** on the drive and move the application through `SHORTLISTED`, `INTERVIEW_SCHEDULED` and `SELECTED` or `REJECTED`. The student gets a notification on every change.
6. Open **Audit Log** as the TPO Admin to see every drive, eligibility and status change with its actor, action and timestamp.

## Project structure

```
plethora-tpo/
  backend/    Spring Boot REST API (com.plethora.tpo)
  frontend/   React and Ant Design single-page app
```

- **Backend** (`backend/src/main/java/com/plethora/tpo/`): `entity/`, `repository/`, `service/`, `controller/`, `security/` and `dto/`
- **Frontend** (`frontend/src/`): `api/` (backend client), `auth/` (JWT session and route guards), `pages/` (`student/`, `admin/`, `company/`, `shared/`) and `components/`

## Security notes

- Change the default admin password and set your own `JWT_SECRET` before running this anywhere other than your own machine.
- Use a dedicated database user, not `root`.
