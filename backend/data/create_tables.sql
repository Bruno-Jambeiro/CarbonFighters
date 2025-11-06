CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followed_id)
);

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

-- Table to track user daily streaks
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    longest_streak INTEGER DEFAULT 0
);

-- Table to track user eco points
CREATE TABLE IF NOT EXISTS user_points (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for groups/challenges
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date DATE,
    is_active BOOLEAN DEFAULT 1
);

-- Table to track user membership in groups
CREATE TABLE IF NOT EXISTS user_groups (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    points INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, group_id)
);
