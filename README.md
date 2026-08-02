# Just Track v2

A personal finance tracking application built as a full-stack monorepo — track your income, expenses, and financial habits with a clean, deliberate design.

![Java](https://img.shields.io/badge/Java-24-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-blue)

---

## Overview

Just Track v2 is a rebuild of the original Just Track app, moving from a JDBC-based backend to a full Spring Boot + React architecture with proper authentication, per-user data scoping, and a polished UI. It's designed to be simple, fast, and genuinely pleasant to use for everyday budget tracking.

## Features

- **Secure authentication** — JWT-based auth with per-user data isolation
- **Transaction tracking** — add, edit, and categorize income and expenses, scoped to the authenticated user
- **User settings** — customizable currency (ISO 4217 validated) and theme preferences, synced end-to-end with optimistic UI updates
- **Custom design system** — a distinctive ink / paper / sage / gold visual identity, not a generic UI kit
- **Production-ready deployment** — backend on Railway, frontend on Vercel, with a dedicated production Postgres database

## Tech Stack

**Backend**
- Java 24, Spring Boot 4.1.0 (Spring 7)
- Spring Security with JWT authentication (`JwtAuthFilter`, `SecurityConfig`, `CustomUserDetailsService`)
- PostgreSQL
- Maven

**Frontend**
- React + Vite
- Axios (with interceptors for Bearer token attachment and auto-logout on 401)
- Context-based state management (e.g. `SettingsContext`) with optimistic updates


## Project Structure

```
just-track-v2/
                # Spring Boot application
├── src/main/java/...
│   ├── controller/       # AuthController, UserSettingsController, TransactionController, ...
│   ├── service/          # UserSettingsService, ...
│   ├── security/         # JwtAuthFilter, SecurityConfig, CustomUserDetailsService
│   ├── dto/
│   ├── model/
│   └── exception/              # GlobalExceptionHandler
└── src/main/resources/
│    └── application.properties
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── api/               # authApi.js, axios instance/interceptors
│   │   ├── auth/               # authStorage.js
│   │   ├── context/            # SettingsContext, etc.
│   │   ├── components/
│   │   └── pages/
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- JDK 24
- Node.js and npm
- PostgreSQL (local instance or a connection string to a hosted instance)
- Maven (or use the included `mvnw` wrapper)

### Backend Setup

```bash
cd backend

# Configure environment variables (or application-local.properties)
# - jwt.secret
# - JWT_EXPIRATION_MS
# - spring.datasource.url / username / password
# - server.servlet.context-path=/api

./mvnw spring-boot:run
```

The backend will be available at `http://localhost:8080/api`.

### Frontend Setup

```bash
cd frontend
npm install

# Configure your API base URL in .env, e.g.:
# VITE_API_BASE_URL=http://localhost:8080/api

npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Environment Variables

| Variable | Where | Description |
|---|---|---|
| `jwt.secret` | Backend | Secret key used to sign JWTs |
| `JWT_EXPIRATION_MS` | Backend | Token expiration time in milliseconds |
| `server.servlet.context-path` | Backend | API base path (`/api`) |
| `spring.datasource.url` | Backend | PostgreSQL connection string |
| `VITE_API_BASE_URL` | Frontend | Base URL the frontend uses to reach the API |

## Deployment

- **Backend** — deployed to Railway, with environment variables configured in the Railway dashboard and a separate production PostgreSQL instance.
- **Frontend** — deployed to Vercel, pointed at the Railway-hosted API.


