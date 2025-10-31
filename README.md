# Carbon Fighters

Gamified sustainability platform: earn points for eco-friendly actions and reduce your carbon footprint.

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: SQLite

## Table of Contents

- Overview
- Project Structure
- Getting Started
  - Prerequisites
  - Backend Setup
  - Frontend Setup
- API Reference
- Environment Variables
- Development and Testing
- Roadmap
- Team
- Course
- Architecture Diagram
- Architectural Styles
  - Layered Architecture
  - Component-based Architecture
- Design Patterns

## Overview

Carbon Fighters is a web application that incentivizes sustainable habits. Users log activities that reduce their carbon footprint and earn points as a reward. The app aims to drive behavior change via challenges, visible progress, and friendly competition.

## Project Structure

```
CarbonFighters/
  backend/        # REST API, authentication, SQLite persistence
  frontend/       # React app (Vite + Tailwind)
  README.md
```

Backend highlights:
- Auth routes under `/auth` with JWT-based sessions
- SQLite database stored in `backend/data/database.sqlite`
- Table creation script: `backend/data/create_tables.sql`

Frontend highlights:
- Vite dev server on http://localhost:5173
- CORS allowed by backend for the frontend dev origin

## Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [Frontend - React]
        FE_App[React App]
        FE_Auth[Auth Views (Login/SignUp)]
        FE_Actions[Actions & Points UI]
    end

    subgraph Backend [Backend - Node/Express]
        API[Express API]
        AuthCtrl[Auth Controller]
        UserSvc[User Service]
        TokenSvc[Token Service (JWT)]
        DBLayer[DB Service]
    end

    subgraph Database [SQLite]
        SQLiteDB[(database.sqlite)]
        Schema[(create_tables.sql)]
    end

    FE_App --> FE_Auth
    FE_App --> FE_Actions

    FE_Auth -->|POST /auth/register| API
    FE_Auth -->|POST /auth/login| API
    FE_Actions -->|future endpoints| API

    API --> AuthCtrl
    AuthCtrl --> UserSvc
    AuthCtrl --> TokenSvc
    UserSvc --> DBLayer
    DBLayer --> SQLiteDB
    Schema -. initializes .-> SQLiteDB
```

## Architectural Styles

### Layered Architecture

Our system follows a layered architecture split into three main layers:

- Frontend
  - User interface built with React and Tailwind CSS
  - Handles forms (login/register) and UI for actions and points
- Backend
  - Core business logic with Express controllers and services
  - Authentication via JWTs, password hashing with bcrypt
- Persistence (Database)
  - SQLite with a simple schema managed via `create_tables.sql`
  - Accessed through a small DB service abstraction

### Component-based Architecture

We also organize the backend by components with focused responsibilities:

- Auth Controller: orchestrates register and login flows
- User Service: user retrieval and creation
- Token Service: JWT creation/verification
- DB Service: lazy, singleton-like database initialization and access

Benefits
- Modularity: components are easy to test and evolve
- Reusability: services can be reused across routes
- Flexibility: enables incremental feature growth (points, leaderboard)

## Design Patterns

- Initialization Pattern (Singleton-like) for DB Service: ensures a single database handle is reused across the app
- Planned: Strategy pattern for points calculation (different scoring strategies per action type)
- Planned: Adapter or Repository to abstract persistence as we move beyond SQLite if needed

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- SQLite 3 (CLI) for local DB initialization

### Backend Setup

1) Install dependencies

```bash
cd backend
npm install
```

2) Create a `.env` file in `backend/`

```
PORT=3000
JWT_SECRET=change-me
JWT_EXPIRATION=1h
```

3) Initialize the local database (creates tables if missing)

```bash
# From the backend directory
sqlite3 ./data/database.sqlite < ./data/create_tables.sql
```

4) Run the API in dev mode

```bash
npm run dev
# Server: http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

## API Reference

Base URL: `http://localhost:3000`

Auth endpoints (route prefix `/auth`):

### POST /auth/register

Request body
```json
{
  "full_name": "John Doe",
  "email": "john@email.com",
  "phone": "+5500987654321",
  "password": "YourPassword123!",
  "date_of_birth": "1990-01-01"
}
```

Success response (201)
```json
{
  "message": "User registered successfully",
  "user": {
    "full_name": "John Doe",
    "email": "john@email.com",
    "created_at": "2025-10-13T10:00:00.000Z"
  },
  "token": "<jwt>"
}
```

Possible errors
```json
{ "error": "All fields are required" }
{ "error": "Email already registered" }
{ "error": "<validation message>" }
```

### POST /auth/login

Request body
```json
{
  "email": "john@email.com",
  "password": "YourPassword123!"
}
```

Success response (200)
```json
{
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "<jwt>"
}
```

Possible errors
```json
{ "error": "Email and password are required" }
{ "error": "Invalid email or password" }
```

## Environment Variables (Backend)

- `PORT` (default: 3000) — HTTP server port.
- `JWT_SECRET` — secret key used to sign JWTs.
- `JWT_EXPIRATION` (default: 1h) — token expiration, e.g., `1h`, `7d`.

Note: CORS is configured to allow `http://localhost:5173` during development.

## Development and Testing

Backend:
```bash
cd backend
npm test
```

Frontend:
- Lint: `npm run lint`
- Build: `npm run build`

## Roadmap

- [ ] User points and achievements
- [ ] Activity catalog (eco-friendly actions)
- [ ] Leaderboard and friends
- [ ] Badges and challenges
- [ ] Profile and history
- [ ] Admin tools (content moderation)

## Team

- [Jeik Pasquel Bustillos](https://github.com/Savage-22) — RA: 298804
- Luiza
- [Fernando Rdrigues](https://github.com/FernandoRST7)
- [Rafael Setton](https://github.com/RafaelSetton)
- Bruno Jambeiro

## Course

This project was developed for the Software Engineering Subject at UNICAMP (MC426 / MC656).

---

Placeholders you can fill next:
- Add screenshots/GIFs of key flows
- Document points calculation logic
- Add deployment instructions (Docker/Azure/etc.)
- Add contribution guidelines and license
