import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;
let filename: string = './data/database.sqlite';

// Allow setting custom database filename (useful for testing or custom configs)
export function setDbFilename(newFilename: string): void {
    if (dbPromise) {
        throw new Error("Database has already been initialized.");
    }
    filename = newFilename;
}

// Reset database connection (useful for testing)
export async function resetDb(): Promise<void> {
    if (dbPromise) {
        const db = await dbPromise;
        await db.close();
        dbPromise = null;
    }
}

export function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (!dbPromise) {
        // Use in-memory database for tests, or custom/default filename for dev
        const isTest = process.env.NODE_ENV === 'test';
        const dbFilename = isTest ? ':memory:' : filename;
        
        dbPromise = open({
            filename: dbFilename,
            driver: sqlite3.Database
        }).then(async (db) => {
            // Enable foreign keys
            await db.exec('PRAGMA foreign_keys = ON');
            
            // Auto-initialize schema (tables + views)
            await initializeDatabase(db);
            
            // Log connection info
            if (isTest) {
                console.log('✅ Connected to in-memory test database');
            } else {
                console.log(`✅ Connected to SQLite database: ${dbFilename}`);
            }
            
            return db;
        });
    }
    return dbPromise;
}

async function initializeDatabase(db: Database<sqlite3.Database, sqlite3.Statement>): Promise<void> {
    // Create users table with improved schema
    await db.exec(`
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
    `);

    // Create follows table for user relationships
    await db.exec(`
        CREATE TABLE IF NOT EXISTS follows (
            follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            PRIMARY KEY (follower_id, followed_id)
        );
    `);

    // Create friends view (mutual follows)
    await db.exec(`
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
    `);
    
    console.log('📊 Database schema initialized (users, follows, friends view)');
}

export async function query(sql: string, params?: any[]): Promise<any> {
    const db = await getDb();
    
    // Detect query type
    const normalizedSql = sql.trim().toUpperCase();
    
    if (normalizedSql.startsWith('SELECT')) {
        // SELECT query - return all rows
        const rows = params ? await db.all(sql, params) : await db.all(sql);
        return { rows };
    } else if (normalizedSql.startsWith('INSERT')) {
        // INSERT query - SQLite doesn't support RETURNING, so we need to query the inserted row
        // Remove RETURNING clause if present
        const cleanSql = sql.replace(/RETURNING \*/gi, '').trim().replace(/;$/, '');
        const result = params ? await db.run(cleanSql, params) : await db.run(cleanSql);
        
        // Get the inserted row by ID
        const insertedRow = await db.get('SELECT * FROM users WHERE id = ?', result.lastID);
        
        return { 
            rows: insertedRow ? [insertedRow] : [],
            rowCount: result.changes 
        };
    } else {
        // UPDATE/DELETE - return affected rows count
        const result = params ? await db.run(sql, params) : await db.run(sql);
        return { 
            rows: [],
            rowCount: result.changes 
        };
    }
}