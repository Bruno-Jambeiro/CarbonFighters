CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL,
    date_of_birth TIMESTAMP,
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
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