# Carbon Fighters

Gamified sustainability platform: earn points for eco-friendly actions and reduce your carbon footprint through friendly competition.

---

## 🎯 **Quick Setup (2 minutes)**

**👉 New to the project?** Read: [QUICK_START.md](./QUICK_START.md)

**TL;DR:**
```bash
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters/backend
npm install
npm test                    # Should pass 30 tests ✅

cd ../frontend
npm install
npm run dev                 # Frontend at http://localhost:5173
```

**That's it!** No Docker or database setup needed - SQLite creates tables automatically on first run.

---

## 🔒 **Security & Environment Variables**

**👉 Before deploying:** Read [SECURITY.md](./SECURITY.md)

Learn about:
- ✅ What goes in `.env.example` (public)
- ❌ What stays in `.env` (private)
- 🚨 What to do if you accidentally commit `.env`
- � Development vs Production secrets

---

## 🚀 Tech Stack

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)

### Frontend
- **React 19+** - UI library with modern hooks
- **TypeScript** - Type safety and developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Minimalist web framework
- **TypeScript** - Strongly typed JavaScript
- **SQLite** - Embedded relational database (zero-config, auto-initialization)
- **bcrypt** - Password hashing (10 salt rounds)
- **jsonwebtoken** - JWT authentication
- **sqlite + sqlite3** - Async SQLite driver with promises

### Testing & Development
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **ESLint** - Code linting
- **ts-node-dev** - TypeScript development server

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#-arquitectura-del-sistema)
  - [Architectural Style](#estilo-arquitectural)
  - [C4 Diagrams](#-diagramas-c4)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Development & Testing](#-development-and-testing)
- [Roadmap](#-roadmap)
- [Team](#-team)

## 📖 Overview

Carbon Fighters is a social web application designed to incentivize sustainable habits through gamification and friendly competition. Users log eco-friendly activities, earn points, participate in challenges, and compete with friends—making sustainability fun and engaging.

**Key Features:**
- 🔐 **Secure Authentication** - JWT-based sessions with bcrypt password hashing
- 👥 **Social Network** - Follow friends and see their eco-friendly actions
- 🏆 **Challenges & Competitions** - Create time-bound challenges or ongoing clubs
- 📊 **Leaderboards** - Real-time rankings within groups
- 🎖️ **Badges & Achievements** - Earn badges for streaks, milestones, and victories
- 📸 **Photo Evidence** - "Pics or it didn't happen" social proof mechanism
- 💬 **Group Chat** - Communicate and motivate within challenges

## 🏗️ System Architecture

### Architectural Style

The project uses a **Layered Architecture** combined with **separation of concerns by components**:

#### Backend: Classic Layered Architecture

```
┌─────────────────────────────────────────┐
│   Presentation Layer (Routes)          │  ← HTTP Endpoints
├─────────────────────────────────────────┤
│   Logic Layer (Controllers)            │  ← Request orchestration
├─────────────────────────────────────────┤
│   Business Layer (Services)            │  ← Business logic
├─────────────────────────────────────────┤
│   Data Layer (DB Service)              │  ← Data access abstraction
├─────────────────────────────────────────┤
│   Persistence Layer (SQLite)           │  ← Embedded database
└─────────────────────────────────────────┘
```

**Main Components:**
- **Routes Layer** - Defines endpoints and maps to controllers (`/auth`, `/actions`, `/groups`)
- **Controllers Layer** - Orchestrates business flows, validations, and HTTP responses
- **Services Layer** - Reusable domain logic (User, Token, Actions, Leaderboard)
- **DB Service** - Singleton SQLite connection with auto-initialization and query abstraction
- **Models** - TypeScript interfaces for data contracts

#### Frontend: Component-Based Architecture

- **React component pattern** with separation of concerns
- **Feature-based organization** (pages, components, services, modules)
- **Backend communication** through centralized HTTP services (`api.ts`)
- **State management** with React hooks (useState, useEffect, useContext)
- **Declarative routing** with React Router

**Structure:**
```
frontend/src/
├── pages/          # Main views (Home, Login, SignUp, Dashboard, Profile)
├── components/     # Reusable components (forms, navigation, UI elements)
├── services/       # API calls abstraction
├── modules/        # Modular features (auth, actions, groups)
└── assets/         # Static resources
```

### Design Patterns

**Implemented:**
- ✅ **Singleton Pattern** - DB Service ensures single database connection instance
  - Location: [`db.service.ts`](backend/src/services/db.service.ts)
  - Benefit: Prevents multiple database connections, manages connection lifecycle
  - Implementation: Uses module-level `dbPromise` variable with lazy initialization
  
- ✅ **Service Layer Pattern** - Business logic separated from controllers
  - Location: [`user.service.ts`](backend/src/services/user.service.ts), [`token.service.ts`](backend/src/services/token.service.ts)
  - Benefit: Reusable business logic, testable in isolation, clear separation of concerns
  
- ✅ **Repository Pattern** (implicit) - User Service abstracts data access
  - Location: [`user.service.ts`](backend/src/services/user.service.ts)
  - Benefit: Decouples business logic from data access, easier to switch databases
  
- ✅ **Component Pattern** - Reusable and composable React components
  - Location: [`frontend/src/components/`](frontend/src/components/)
  - Examples: `FormInput`, `PasswordStrengthBar`, `FormSubmitButton`
  - Benefit: Code reusability, consistent UI, easier maintenance

- ✅ **Factory Pattern** - Centralized badge creation with extensibility
  - Location: [`badge.factory.ts`](backend/src/factories/badge.factory.ts)
  - Model: [`badge.model.ts`](backend/src/models/badge.model.ts)
  - Tests: [`badge.factory.test.ts`](backend/tests/factories/badge.factory.test.ts) (30 tests, 100% coverage)
  - Frontend Demo: [`Badges.tsx`](frontend/src/pages/Badges.tsx)
  - **What it does:** Creates 4 types of badges (STREAK, MILESTONE, SPECIAL, CATEGORY) with specific business logic
  - **Example Usage:**
    ```typescript
    import { BadgeFactory, BadgeType } from '@/factories/badge.factory';
    
    // Create a 7-day streak badge
    const streakBadge = BadgeFactory.createBadge(BadgeType.STREAK, 7);
    // Returns: { name: "7 Dias de Fogo", icon: "🔥", points: 70, ... }
    
    // Create a milestone badge for 100 actions
    const milestoneBadge = BadgeFactory.createBadge(BadgeType.MILESTONE, 100);
    // Returns: { name: "Eco Rookie", icon: "🌱", points: 100, ... }
    
    // Get all available badge types
    const types = BadgeFactory.getAvailableBadgeTypes();
    // Returns: ['streak', 'milestone', 'special', 'category']
    
    // Get example badges for demo/testing
    const examples = BadgeFactory.getExampleBadges();
    ```
  - **Benefits:**
    - ✅ **Single Responsibility:** Badge creation logic centralized in one place
    - ✅ **Open/Closed Principle:** Easy to extend with new badge types without modifying existing code
    - ✅ **DRY Principle:** Eliminates duplicate badge creation logic across codebase
    - ✅ **Maintainability:** Changes to badge logic only need to be made in one file
    - ✅ **Testability:** Isolated factory can be thoroughly unit tested
  - **Badge Types Supported:**
    - � **STREAK** - Consecutive days (7/30/100+ days) → Points = days × 10
    - 🏆 **MILESTONE** - Action count (10/50/100/500/1000/5000+ actions) → Points = action count
    - ⭐ **SPECIAL** - Event-based (Dia da Terra, Zero Waste, etc.) → Fixed points per event
    - 🎖️ **CATEGORY** - Specialization (Transport/Recycling/Water/Energy) → 300 points + 50 actions required

**Planned:**
- 🔄 **Strategy Pattern** - Points calculation with different strategies per action type
- 🔄 **Observer Pattern** - Real-time notification system

## 📐 C4 Diagrams

The following diagrams show the system architecture at three levels of abstraction according to the C4 model.

### Level 1: Context Diagram

Shows the Carbon Fighters system and its interactions with users and external systems.

```mermaid
C4Context
    title C4 Diagram - Carbon Fighters System Context

    Person(user, "End User", "Person looking to reduce their carbon footprint and compete with friends")
    Person(admin, "Administrator", "Manages content, moderates actions, and views system metrics")

    System(carbonFighters, "Carbon Fighters", "Gamified web platform that incentivizes sustainable habits through points, challenges, and social competition")

    System_Ext(emailService, "Email Service", "Sends notifications, account verification, and password recovery")
    System_Ext(cloudStorage, "Cloud Storage", "Stores photos of sustainable action evidence")
    System_Ext(socialAuth, "OAuth Providers", "Social authentication (Google, Facebook)")

    Rel(user, carbonFighters, "Logs sustainable actions, participates in challenges, competes with friends", "HTTPS")
    Rel(admin, carbonFighters, "Manages content, moderates users, views analytics", "HTTPS")
    
    Rel(carbonFighters, emailService, "Sends notifications and verification emails", "SMTP/API")
    Rel(carbonFighters, cloudStorage, "Stores and retrieves evidence photos", "HTTPS/S3")
    Rel(carbonFighters, socialAuth, "Authenticates users", "OAuth 2.0")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### Level 2: Container Diagram

Shows the main containers: Frontend (SPA), Backend (API), and Database.

```mermaid
C4Container
    title C4 Diagram - Carbon Fighters Container

    Person(user, "User", "Person using Carbon Fighters")

    System_Boundary(carbonFighters, "Carbon Fighters") {
        Container(spa, "Single Page Application", "React + Vite + TypeScript", "Provides user interface for registration, login, dashboard, and points/badges visualization")
        
        Container(api, "REST API", "Node.js + Express + TypeScript", "Provides authentication, user management, and business logic functionality via JSON/HTTPS")
        
        ContainerDb(db, "Database", "SQLite", "Stores users, sustainable actions, points, badges, groups, challenges, and social relationships")
    }

    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari")

    Rel(user, browser, "Uses", "")
    Rel(browser, spa, "Visits", "HTTPS [port 5173 dev]")
    
    Rel(spa, api, "Makes API calls", "JSON/HTTPS [port 3000]")
    
    Rel(api, db, "Reads/Writes", "SQL via sqlite driver [file: ./data/database.sqlite]")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### Level 3: Component Diagram (Backend)

Details the internal structure of the backend API with its components and dependencies.

```mermaid
C4Component
    title C4 Diagram - Backend API Components (Express)

    Container_Boundary(api, "REST API - Express Application") {
        
        Component(expressApp, "Express App", "Express.js", "Entry point, configures middleware (CORS, JSON parser) and mounts routes")
        
        Component(authRoutes, "Auth Routes", "Express Router", "Endpoints: POST /auth/register, POST /auth/login")
        
        Component(authController, "Auth Controller", "TypeScript Module", "Orchestrates registration and login: validations, hashing, tokens")
        
        Component(userService, "User Service", "TypeScript Module", "User CRUD: getAllUsers(), getUser(), getUserByCpf(), createUser()")
        
        Component(tokenService, "Token Service", "TypeScript Module", "JWT generation and verification: generateToken(), verifyToken()")
        
        Component(dbService, "Database Service", "TypeScript Module", "PostgreSQL singleton pool, executes parameterized SQL queries")
        
        Component(validationUtils, "Validation Utils", "TypeScript Module", "Validations: email format, password strength")
        
        Component(userModel, "User Model", "TypeScript Interface", "Defines User contract: id_user, firstName, lastName, cpf, email, password, etc.")
    }
    
    ContainerDb_Ext(sqlite, "SQLite Database", "SQLite 3", "File-based database at ./data/database.sqlite with auto-initialized schema")
    
    Container_Ext(frontend, "React SPA", "Client consuming the API")

    Rel(frontend, expressApp, "HTTP Requests", "JSON/HTTPS")
    Rel(expressApp, authRoutes, "Routes to", "")
    Rel(authRoutes, authController, "Delegates to", "register(), login()")
    Rel(authController, validationUtils, "Uses", "validateEmailFormat(), validatePasswordStrength()")
    Rel(authController, userService, "Calls", "getUser(), createUser()")
    Rel(authController, tokenService, "Uses", "generateToken()")
    Rel(userService, dbService, "Executes queries", "query(sql, params)")
    Rel(userService, userModel, "Returns/receives", "User interface")
    Rel(dbService, sqlite, "db.all() / db.run()", "SQL via sqlite driver (async)")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 📁 Project Structure

```
CarbonFighters/
├── backend/                    # REST API con Express + TypeScript
│   ├── data/                   # SQL schema (create_tables.sql)
│   ├── src/
│   │   ├── controllers/        # Request handlers (auth.controller.ts)
│   │   ├── factories/          # Creation of Badges
│   │   ├── models/             # TypeScript interfaces (user.model.ts)
│   │   ├── routes/             # Endpoint definitions (auth.routes.ts)
│   │   ├── services/           # Business logic (user, token, db services)
│   │   ├── utils/              # Helper functions (validations.utils.ts)
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── tests/                  # Jest test suites
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/                   # React SPA con Vite + TypeScript
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── assets/             # Static resources
│   │   ├── components/         # Reusable components
│   │   │   ├── footer/         # Footer components (FooterDash)
│   │   │   ├── forms/          # Form components (formInput, formSubmitButton)
│   │   │   └── headers/        # Header components (HeaderDash)
│   │   ├── pages/              # Main views (Login, SignUp, Dashboard, Home, Profile)
│   │   ├── services/           # API client (api.ts)
│   │   ├── App.tsx             # Root component with routing
│   │   └── main.tsx            # Entry point
│   └── package.json
│
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── test.yml            # CI/CD pipeline
│
├── evidences/                  # Research and interviews
│   └── interview/              # User interview transcriptions
│
└── README.md                   # This file
```

### Backend Architecture Details

**Authentication Flow:**
```
POST /auth/register
  ↓
auth.controller.register()
  ↓
├─ validateEmailFormat() ────────────┐
├─ validatePasswordStrength() ───────┤ validations.utils.ts
└─ user.service.createUser() ────────┤ user.service.ts
    └─ db.service.query() ───────────┤ db.service.ts (SQLite Singleton)
        └─ INSERT INTO users ────────┘ Auto-creates schema if needed
  ↓
token.service.generateToken() ───────┐ token.service.ts (JWT)
  ↓
Response: { user, token }
```

**Database Service Features:**
- **Singleton Pattern**: Single database connection managed throughout application lifecycle
- **Auto-initialization**: Tables and views created automatically on first connection
- **Test/Dev Separation**: Uses `:memory:` for tests, `./data/database.sqlite` for development
- **Query Abstraction**: Handles SQLite-specific syntax (e.g., simulates `RETURNING` clause)

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)

That's it! No database installation needed - SQLite is embedded.

---

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Configure Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```bash
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=1h

# Database (optional - defaults to ./data/database.sqlite)
DB_PATH=./data/database.sqlite
```

**⚠️ Security Note:** Never commit `.env` files to version control. Use strong, unique secrets in production.

#### 3. Run the Backend

```bash
npm run dev
# Server running at: http://localhost:3000
# Database auto-created at ./data/database.sqlite
```

**Available Scripts:**
- `npm run dev` - Run with hot reload (ts-node-dev)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm test` - Run test suite with Jest (uses in-memory SQLite)

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Run the Frontend Development Server

```bash
npm run dev
# App running at: http://localhost:5173
```

**Available Scripts:**
- `npm run dev` - Start Vite dev server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Running the Full Stack

Open two terminal windows:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Then navigate to `http://localhost:5173` in your browser.

## 📡 API Reference

**Base URL:** `http://localhost:3000`

### Authentication Endpoints

All authentication endpoints are prefixed with `/auth`.

---

#### `POST /auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "cpf": "12345678901",
  "email": "john.doe@example.com",
  "phone": "+5511987654321",
  "birthday": "1990-01-15",
  "password": "SecurePass123!"
}
```

**Required Fields:**
- `firstName` (string) - User's first name
- `lastName` (string) - User's last name
- `cpf` (string) - Brazilian CPF (11 digits, unique)
- `password` (string) - Must meet strength requirements

**Optional Fields:**
- `email` (string) - Valid email address (unique if provided)
- `phone` (string) - Phone number with country code
- `birthday` (string) - Date in YYYY-MM-DD format

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (`!@#$%^&*(),.?":{}|<>_-+=~`)

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id_user": 123,
    "firstName": "John",
    "lastName": "Doe",
    "cpf": "12345678901",
    "email": "john.doe@example.com",
    "phone": "+5511987654321",
    "birthday": "1990-01-15",
    "created_at": "2025-11-06T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 400 | `"firstName, lastName, cpf and password are required"` | Missing required fields |
| 400 | `"Email already registered"` | Email already exists in database |
| 400 | `"CPF already registered"` | CPF already exists in database |
| 400 | `"Invalid email format"` | Email doesn't match RFC 5322 |
| 400 | `"Password must be at least 8 characters long"` | Password too short |
| 400 | `"Password must contain at least one uppercase letter"` | Missing uppercase |
| 500 | `"Server error"` | Internal server error |

---

#### `POST /auth/login`

Authenticate an existing user.

**Request Body (Option 1 - Email):**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Request Body (Option 2 - CPF):**
```json
{
  "cpf": "12345678901",
  "password": "SecurePass123!"
}
```

**Required Fields:**
- `password` (string) - User's password
- `email` (string) **OR** `cpf` (string) - One identifier is required

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id_user": 123,
    "firstName": "John",
    "lastName": "Doe",
    "cpf": "12345678901",
    "email": "john.doe@example.com",
    "phone": "+5511987654321",
    "birthday": "1990-01-15",
    "created_at": "2025-11-06T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 400 | `"CPF or Email and password are required"` | Missing credentials |
| 401 | `"Invalid credentials"` | Wrong email/CPF or password |
| 500 | `"Server error"` | Internal server error |

---

### JWT Token Usage

The returned token should be included in subsequent authenticated requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "id": 123,
  "email": "john.doe@example.com",
  "iat": 1699276800,
  "exp": 1699280400
}
```

**Token Expiration:** Configurable via `JWT_EXPIRATION` (default: 1 hour)

---

### Future Endpoints (Planned)

#### Actions
- `POST /actions` - Log a sustainable action
- `GET /actions` - Get user's action history
- `GET /actions/:id` - Get specific action details

#### Leaderboards
- `GET /leaderboards/global` - Global leaderboard
- `GET /leaderboards/friends` - Friends leaderboard
- `GET /leaderboards/group/:id` - Group-specific leaderboard

#### Groups & Challenges
- `POST /groups` - Create a new group/challenge
- `GET /groups` - List user's groups
- `POST /groups/:id/join` - Join a group
- `GET /groups/:id/members` - Get group members and rankings

#### Badges
- `GET /badges` - Get user's earned badges
- `GET /badges/available` - Get available badges to earn

---

### CORS Configuration

The backend allows requests from:
- `http://localhost:5173` (Frontend development server)

In production, update CORS to allow your deployed frontend domain.

## 🧪 Development and Testing

### Backend Testing

The backend uses **Jest** with **Supertest** for integration testing.

```bash
cd backend
npm test
```

**Test Features:**
- Uses in-memory SQLite (`:memory:`) for fast, isolated tests
- Automatic schema initialization
- 30 tests covering authentication endpoints
- No cleanup needed - database destroyed after each test suite

**Running Tests:**
```bash
npm test                  # Run all tests
npm test -- --watch      # Run in watch mode
npm test -- --coverage   # Generate coverage report
```

### Frontend Development

**Linting:**
```bash
cd frontend
npm run lint              # Check for linting errors
```

**Building:**
```bash
npm run build             # Production build
npm run preview           # Preview production build
```

**Code Quality Tools:**
- ESLint with TypeScript support
- React Hooks linting rules
- Auto-formatting recommendations (Prettier compatible)

### Git Workflow

**Branches:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches (e.g., `feature/frontend/user-main-body`)
- `docs/*` - Documentation branches (e.g., `docs/architecture`)

**GitHub Actions CI/CD:**
```yaml
# .github/workflows/test.yml
- Runs on: push to main, pull requests
- Executes: Backend test suite
- Checks: Code compilation, test coverage
```

## 👥 Team

- [Jeik Pasquel Bustillos](https://github.com/Savage-22) — RA: 298804
- Luiza
- Fernando
- [Rafael Setton](https://github.com/RafaelSetton)
- [Bruno Jambeiro](https://github.com/Bruno-Jambeiro)

## 🎓 Course

This project was developed for the **Software Engineering** course at UNICAMP (MC426 / MC656).

**Institution:** State University of Campinas (UNICAMP)  
**Department:** Institute of Computing (IC)  
**Year:** 2025

---

## 📄 License

This project is licensed for educational purposes as part of the MC426/MC656 course at UNICAMP.

## 🤝 Contributing

This is an academic project. Contributions are welcome from team members. For major changes:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Contact

For questions or suggestions, please contact the team members via GitHub.

---

**Made with 💚 for a sustainable future**
