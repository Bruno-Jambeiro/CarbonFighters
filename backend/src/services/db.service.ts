import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';

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
    // Read schema from external SQL file instead of hardcoded statements
    const candidates = [
        // When running from compiled JS in dist
        path.resolve(__dirname, '../../data/create_tables.sql'),
        // Project root execution (e.g. ts-node / jest from root)
        path.resolve(process.cwd(), 'backend', 'data', 'create_tables.sql'),
        // Fallback if working directory already inside backend
        path.resolve(process.cwd(), 'data', 'create_tables.sql')
    ];

    let ddl: string | null = null;
    let usedPath: string | null = null;

    for (const p of candidates) {
        try {
            ddl = await fs.readFile(p, 'utf-8');
            usedPath = p;
            break;
        } catch {
            // try next
        }
    }

    if (!ddl) {
        throw new Error('create_tables.sql not found in expected locations: ' + candidates.join(', '));
    }

    await db.exec(ddl);
    console.log(`📊 Database schema initialized from SQL file: ${usedPath}`);
}

export async function dbRun(sql: string, params?: any[]): Promise<{ lastID?: number, changes?: number }> {
    // Executes a query that does not return rows (INSERT, UPDATE, DELETE).
    // Returns the result from the 'run' operation (e.g., lastID, changes).
    
    const db = await getDb();
    const result = params ? await db.run(sql, params) : await db.run(sql);
    
    // The 'sqlite' wrapper returns an object with lastID and changes
    return result;
}

export async function dbGet<T>(sql: string, params?: any[]): Promise<T | undefined> {
    // Executes a query that returns a single row.
    // Returns the row object or undefined.

    const db = await getDb();
    const row = params ? await db.get<T>(sql, params) : await db.get<T>(sql);
    return row;
}

export async function dbAll<T>(sql: string, params?: any[]): Promise<T[]> {
    // Executes a query that returns multiple rows.
    // Returns an array of row objects.

    const db = await getDb();
    const rows = params ? await db.all<T[]>(sql, params) : await db.all<T[]>(sql);
    return rows;
}