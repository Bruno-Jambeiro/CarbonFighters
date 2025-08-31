import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export function getDb() {
    if (!dbPromise) {
        dbPromise = open({
            filename: './data/database.sqlite',
            driver: sqlite3.Database
        });
    }
    return dbPromise;
}