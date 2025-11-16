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

-- =========================
-- Badges Table (CA1: Conjunto predefinido de hitos)
-- =========================
CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'streak', 'milestone', 'special', 'category'
    icon TEXT NOT NULL,
    requirement INTEGER NOT NULL, -- Valor numérico del requisito
    requirement_type TEXT NOT NULL, -- 'actions_count', 'streak_days', 'group_join', 'category_count'
    category TEXT, -- Para badges de categoría específica
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- User Badges Table (CA2: Asociar insignias al perfil del usuario)
-- =========================
CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id) -- Un usuario no puede ganar el mismo badge dos veces
);

-- =========================
-- Notifications Table (CA3: Notificar cuando se gana una insignia)
-- =========================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'badge_earned', 'group_invite', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);