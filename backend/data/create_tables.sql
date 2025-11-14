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


CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_type INTEGER NOT NULL,
    user_id INTEGER NOT NULL REFERENCES user(id),
    imagem_path TEXT NOT NULL,  --path to image from the data directory 
    validated_by INTEGER REFERENCES user(id) DEFAULT NULL -- Initially null. When another user validates this activity it will be assigned to that user's id
);
