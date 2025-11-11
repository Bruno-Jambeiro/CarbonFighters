CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    date_of_birth TIMESTAMP NOT NULL,
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


CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activity_type INTEGER NOT NULL,
    activity_duration INTEGER NOT NULL, -- In minutes
    user_id INTEGER NOT NULL REFERENCES user(id),
    validated_by INTEGER REFERENCES user(id) DEFAULT NULL -- Initially null. When another user validates this activity it will be assigned to that user's id
);

CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_public INTEGER NOT NULL DEFAULT 0,
    community_type INTEGER NOT NULL -- Defines if it is cooperative, competitive, etc.
);

CREATE TABLE IF NOT EXISTS user_communities (
    user_id INTEGER REFERENCES users(id),
    community_id INTEGER REFERENCES communities(id),
    PRIMARY KEY (user_id, community_id)
);
