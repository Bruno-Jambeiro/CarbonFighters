-- CarbonFighters Database Schema
-- SQLite Database

-- =========================
-- User Table
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    birthday TEXT,
    password TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    last_action_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Groups Table
-- =========================
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Group Members Table (Many-to-Many relationship between users and groups)
-- =========================
CREATE TABLE IF NOT EXISTS group_members (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id)
);

-- =========================
-- Sustainable Actions Table
-- =========================
CREATE TABLE IF NOT EXISTS sustainable_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'transport', 'recycling', 'water', 'energy', etc.
    description TEXT NOT NULL,
    carbon_saved REAL DEFAULT 0, -- kg of CO2
    points INTEGER DEFAULT 10,
    action_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);