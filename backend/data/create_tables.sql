-- CarbonFighters Database Schema
-- SQLite Database

-- Users table with complete profile information
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

-- Follows table for user relationships (follower -> followed)
CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followed_id)
);

-- Friends view: mutual follows (when two users follow each other)
CREATE VIEW IF NOT EXISTS friends AS
SELECT
    f1.follower_id AS user1_id,
    f1.followed_id AS user2_id
FROM
    follows f1
    JOIN follows f2
        ON f1.follower_id = f2.followed_id
        AND f1.followed_id = f2.follower_id
WHERE
    f1.follower_id < f1.followed_id;
