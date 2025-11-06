# Carbon Fighters

Gamified sustainability platform: earn points for eco-friendly actions and reduce your carbon footprint through friendly competition.

---

## 🎯 **Quick Setup (5 minutes)**

**👉 New to the project?** Read: [QUICK_START.md](./QUICK_START.md) (Portuguese)

**TL;DR:**
```bash
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters
./setup.sh  # or setup.bat on Windows
```

**That's it!** The script installs everything automatically.

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
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white&style=for-the-badge)
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
- **PostgreSQL** - Relational database with advanced features
- **bcrypt** - Password hashing (7 salt rounds)
- **jsonwebtoken** - JWT authentication
- **pg (node-postgres)** - PostgreSQL driver with connection pooling

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
│   Persistence Layer (PostgreSQL)       │  ← Storage layer
└─────────────────────────────────────────┘
```

**Main Components:**
- **Routes Layer** - Defines endpoints and maps to controllers (`/auth`, `/actions`, `/groups`)
- **Controllers Layer** - Orchestrates business flows, validations, and HTTP responses
- **Services Layer** - Reusable domain logic (User, Token, Actions, Leaderboard)
- **DB Service** - Singleton PostgreSQL connection pool with parameterized queries
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
- ✅ **Singleton Pattern** - DB Service with single connection pool
- ✅ **Service Layer Pattern** - Business logic separation
- ✅ **Repository Pattern** (implicit) - User Service abstracts data access
- ✅ **Component Pattern** - Reusable and composable React components

**Planned:**
- 🔄 **Strategy Pattern** - Points calculation with different strategies per action type
- 🔄 **Observer Pattern** - Real-time notification system
- 🔄 **Factory Pattern** - Badges and achievements generation

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
        
        ContainerDb(db, "Database", "PostgreSQL", "Stores users, sustainable actions, points, badges, groups, challenges, and social relationships")
    }

    System_Ext(browser, "Web Browser", "Chrome, Firefox, Safari")

    Rel(user, browser, "Uses", "")
    Rel(browser, spa, "Visits", "HTTPS [port 5173 dev]")
    
    Rel(spa, api, "Makes API calls", "JSON/HTTPS [port 3000]")
    
    Rel(api, db, "Reads/Writes", "SQL via pg driver [port 5432]")

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
    
    ContainerDb_Ext(postgres, "PostgreSQL Database", "PostgreSQL 14+", "Stores users table with indexes on email and cpf")
    
    Container_Ext(frontend, "React SPA", "Client consuming the API")

    Rel(frontend, expressApp, "HTTP Requests", "JSON/HTTPS")
    Rel(expressApp, authRoutes, "Routes to", "")
    Rel(authRoutes, authController, "Delegates to", "register(), login()")
    Rel(authController, validationUtils, "Uses", "validateEmailFormat(), validatePasswordStrength()")
    Rel(authController, userService, "Calls", "getUser(), createUser()")
    Rel(authController, tokenService, "Uses", "generateToken()")
    Rel(userService, dbService, "Executes queries", "query(sql, params)")
    Rel(userService, userModel, "Returns/receives", "User interface")
    Rel(dbService, postgres, "Pool.query()", "SQL via pg driver")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 📁 Project Structure

```
CarbonFighters/
├── backend/                    # REST API con Express + TypeScript
│   ├── src/
│   │   ├── controllers/        # Request handlers (auth.controller.ts)
│   │   ├── services/           # Business logic (user, token, db services)
│   │   ├── routes/             # Endpoint definitions (auth.routes.ts)
│   │   ├── models/             # TypeScript interfaces (user.model.ts)
│   │   ├── utils/              # Helper functions (validations.utils.ts)
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── tests/                  # Jest test suites
│   ├── data/                   # SQL schema (create_tables.sql)
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/                   # React SPA con Vite + TypeScript
│   ├── src/
│   │   ├── pages/              # Main views (Login, SignUp, Dashboard, Home, Profile)
│   │   ├── components/         # Reusable components
│   │   │   ├── forms/          # Form components (formInput, formSubmitButton)
│   │   │   ├── headers/        # Header components (HeaderDash)
│   │   │   └── footer/         # Footer components (FooterDash)
│   │   ├── services/           # API client (api.ts)
│   │   ├── modules/            # Feature modules (auth)
│   │   ├── assets/             # Static resources
│   │   ├── App.tsx             # Root component with routing
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Public assets
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
    └─ db.service.query() ───────────┤ db.service.ts (PostgreSQL Pool)
        └─ INSERT INTO users ────────┘ 
  ↓
token.service.generateToken() ───────┐ token.service.ts (JWT)
  ↓
Response: { user, token }
```

## 🚀 Getting Started

### Prerequisites

Choose **one** of the following options:

#### Option 1: Docker (Recommended - 30 seconds setup) 🐳

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
  - Windows/Mac: Install Docker Desktop
  - Linux: Install `docker` and `docker-compose`

**Advantages:**
- ✅ Zero database configuration
- ✅ Works identically on all machines
- ✅ Isolated environment (doesn't affect your system)
- ✅ Automatic table creation

#### Option 2: Traditional Setup (Manual PostgreSQL)

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** - Package manager (comes with Node.js)

---

## 🐳 Quick Start with Docker (Recommended)

**⚠️ CRITICAL: Don't skip step 2!** Create `.env` files or nothing will work.

```bash
# 1. Clone
git clone https://github.com/Bruno-Jambeiro/CarbonFighters.git
cd CarbonFighters

# 2. Create environment files (REQUIRED!)
cd backend
cp .env.example .env
cp .env.example .env.test
cd ..

# 3. Start databases
docker-compose up -d

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

**Verify it works:**
```bash
docker-compose ps        # Should show 2 containers "Up (healthy)"
cd backend && npm test   # Should show "30 passed"
```

**For detailed instructions:** See [QUICK_START.md](./QUICK_START.md)

**For security best practices:** See [SECURITY.md](./SECURITY.md)

---

## 🔧 Manual Setup (Without Docker)

**Not recommended.** PostgreSQL setup takes 1-2 hours vs 5 minutes with Docker.

If you really want to:
- Development database on port **5432**
- Test database on port **5433**
- All tables automatically created

### Continue with Backend and Frontend

```bash
# Backend setup
cd backend
npm install
npm run dev    # Backend running at http://localhost:3000

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev    # Frontend running at http://localhost:5173
```

### Useful Docker Commands

```bash
# Check databases are running
docker-compose ps

# View database logs
docker logs carbonfighters-db

# Stop databases
docker-compose stop

# Start databases (if already created)
docker-compose start

# Restart databases
docker-compose restart

# Remove everything (⚠️ deletes all data)
docker-compose down -v

# Connect to database (psql)
docker exec -it carbonfighters-db psql -U carbonfighters_user -d carbonfighters
```

### Troubleshooting

**Port already in use?**
```bash
# Stop local PostgreSQL first
# Windows: Stop PostgreSQL service
# macOS: brew services stop postgresql
# Linux: sudo systemctl stop postgresql
```

**For detailed Docker instructions, see:** [📖 DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

## 🔧 Manual Setup (Without Docker)

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

#### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=1h

# PostgreSQL Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=carbonfighters
DB_PASSWORD=your-password
DB_PORT=5432
```

**⚠️ Security Note:** Never commit `.env` files to version control. Use strong, unique secrets in production.

#### 3. Initialize PostgreSQL Database

```bash
# Create the database (run in PostgreSQL)
psql -U postgres
CREATE DATABASE carbonfighters;
\q

# Run the schema creation script
psql -U postgres -d carbonfighters -f data/create_tables.sql
```

Alternatively, the tables will be created automatically on first run if using migrations.

#### 4. Run the Backend in Development Mode

```bash
npm run dev
# Server running at: http://localhost:3000
```

**Available Scripts:**
- `npm run dev` - Run with hot reload (ts-node-dev)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm test` - Run test suite with Jest

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

**Test Structure:**
```
backend/tests/
├── setup.ts              # Test configuration
└── auth/
    ├── register.test.ts  # Registration endpoint tests
    └── login.test.ts     # Login endpoint tests
```

**Test Environment:**
- Uses `.env.test` for test-specific configuration
- Separate test database to avoid polluting development data
- Automatic cleanup after tests

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

## 🗺️ Roadmap

### ✅ Completed
- [x] User authentication (register/login with JWT)
- [x] PostgreSQL database integration
- [x] Password hashing with bcrypt
- [x] Email and CPF validation
- [x] Frontend routing (React Router)
- [x] Responsive UI with Tailwind CSS
- [x] Form components with validation
- [x] Protected routes (Dashboard)

### 🚧 In Progress
- [ ] User profile management
- [ ] Dashboard main body implementation
- [ ] Action logging system

### 📋 Planned Features

#### Phase 1: Core Gamification (MVP)
- [ ] **Sustainable Actions Catalog**
  - Predefined eco-friendly actions with point values
  - Categories: Transport, Energy, Food, Waste, Water
  - Manual action logging
  
- [ ] **Points System**
  - Award "Eco Points" for logged actions
  - Points history and statistics
  - Daily streak tracking

- [ ] **Badges & Achievements**
  - Streak badges (7 days, 30 days, 100 days)
  - Milestone badges (100 actions, 1000 points, etc.)
  - Special event badges

#### Phase 2: Social Features
- [ ] **Follow System**
  - Follow/unfollow users
  - Friends view (mutual follows)
  - Activity feed from friends

- [ ] **Groups & Challenges**
  - User-created groups (public/private/invite-only)
  - Time-bound challenges with winners
  - Ongoing clubs for long-term accountability
  - Group chat integration

- [ ] **Leaderboards**
  - Global leaderboard (all users)
  - Friends leaderboard
  - Group-specific leaderboards
  - Real-time ranking updates

#### Phase 3: Verification & Trust
- [ ] **Photo Evidence**
  - Upload photos for action verification
  - "Pics or it didn't happen" mechanism
  - Social proof on activity feed
  - Cloud storage integration (AWS S3/Cloudinary)

- [ ] **Action Validation**
  - Community reporting for fake actions
  - Admin moderation tools
  - Automated fraud detection

#### Phase 4: Advanced Features
- [ ] **Carbon Footprint Calculator**
  - Onboarding questionnaire
  - Personalized baseline calculation
  - Integration with Carbon API (CarbonInterface/Climatiq)
  - Progress tracking vs. baseline

- [ ] **Notifications System**
  - Email notifications (SendGrid/AWS SES)
  - Challenge invitations
  - Streak reminders
  - Badge unlocks
  - Leaderboard position changes

- [ ] **Analytics Dashboard**
  - Personal impact metrics (CO₂ saved, trees planted equivalent)
  - Monthly reports
  - Comparison with friends
  - Admin analytics

#### Phase 5: Monetization & Growth
- [ ] **Premium Features**
  - Ad-free experience
  - Exclusive badges
  - Custom challenge creation
  - Advanced analytics

- [ ] **Partnerships**
  - Donate points to environmental NGOs
  - Brand partnerships for special challenges
  - Rewards marketplace

### 🔧 Technical Improvements
- [ ] API rate limiting
- [ ] Request/response logging (Morgan)
- [ ] Error tracking (Sentry)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database migrations system
- [ ] Docker containerization
- [ ] CI/CD pipeline improvements
- [ ] Performance monitoring
- [ ] WebSocket integration for real-time features

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
