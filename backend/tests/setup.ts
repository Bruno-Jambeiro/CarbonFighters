import { getDb, query } from "../src/services/db.service";

beforeAll(async () => {
    // For tests, we use the same PostgreSQL connection
    // but ensure tables are clean before running tests
    
    try {
        // Clean tables before each test suite
        await query('DROP VIEW IF EXISTS friends;');
        await query('DROP TABLE IF EXISTS follows CASCADE;');
        await query('DROP TABLE IF EXISTS users CASCADE;');
        
        // Create users table
        await query(`
            CREATE TABLE users (
                id_user SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                email VARCHAR(150) UNIQUE,
                phone VARCHAR(20),
                birthday DATE,
                created_at DATE DEFAULT CURRENT_TIMESTAMP,
                password VARCHAR(255) NOT NULL
            );
        `);
        
        // Create follows table
        await query(`
            CREATE TABLE follows (
                follower_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE,
                followed_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE,
                PRIMARY KEY (follower_id, followed_id)
            );
        `);
        
        // Create friends view
        await query(`
            CREATE VIEW friends AS
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
        `);
    } catch (error) {
        console.error('Error setting up test database:', error);
        throw error;
    }
});

afterAll(async () => {
    // Close database connection
    const pool = getDb();
    await pool.end();
});