CREATE TABLE IF NOT EXISTS users (
    id_user SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    birthday DATE,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE,
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