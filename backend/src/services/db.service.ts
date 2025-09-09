import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;
let filename: string = './data/database.sqlite';

export function setDbFilename(newFilename: string) {
    if (dbPromise) {
        throw new Error("Database has already been initialized.");
    }
    filename = newFilename;
}

export function getDb() {
    if (!dbPromise) {
        dbPromise = open({
            filename,
            driver: sqlite3.Database
        });
    }
    return dbPromise;
}