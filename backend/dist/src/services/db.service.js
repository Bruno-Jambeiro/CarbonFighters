"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDbFilename = setDbFilename;
exports.resetDb = resetDb;
exports.getDb = getDb;
exports.dbRun = dbRun;
exports.dbGet = dbGet;
exports.dbAll = dbAll;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
let dbPromise = null;
let filename = './data/database.sqlite';
// Allow setting custom database filename (useful for testing or custom configs)
function setDbFilename(newFilename) {
    if (dbPromise) {
        throw new Error("Database has already been initialized.");
    }
    filename = newFilename;
}
// Reset database connection (useful for testing)
function resetDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dbPromise) {
            const db = yield dbPromise;
            yield db.close();
            dbPromise = null;
        }
    });
}
function getDb() {
    if (!dbPromise) {
        // Use in-memory database for tests, or custom/default filename for dev
        const isTest = process.env.NODE_ENV === 'test';
        const dbFilename = isTest ? ':memory:' : filename;
        dbPromise = (0, sqlite_1.open)({
            filename: dbFilename,
            driver: sqlite3_1.default.Database
        }).then((db) => __awaiter(this, void 0, void 0, function* () {
            // Enable foreign keys
            yield db.exec('PRAGMA foreign_keys = ON');
            // Auto-initialize schema (tables + views)
            yield initializeDatabase(db);
            // Log connection info
            if (isTest) {
                console.log('✅ Connected to in-memory test database');
            }
            else {
                console.log(`✅ Connected to SQLite database: ${dbFilename}`);
            }
            return db;
        }));
    }
    return dbPromise;
}
function initializeDatabase(db) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read schema from external SQL file instead of hardcoded statements
        const candidates = [
            // When running from compiled JS in dist
            path_1.default.resolve(__dirname, '../../data/create_tables.sql'),
            // Project root execution (e.g. ts-node / jest from root)
            path_1.default.resolve(process.cwd(), 'backend', 'data', 'create_tables.sql'),
            // Fallback if working directory already inside backend
            path_1.default.resolve(process.cwd(), 'data', 'create_tables.sql')
        ];
        let ddl = null;
        let usedPath = null;
        for (const p of candidates) {
            try {
                ddl = yield promises_1.default.readFile(p, 'utf-8');
                usedPath = p;
                break;
            }
            catch (_a) {
                // try next
            }
        }
        if (!ddl) {
            throw new Error('create_tables.sql not found in expected locations: ' + candidates.join(', '));
        }
        yield db.exec(ddl);
        console.log(`📊 Database schema initialized from SQL file: ${usedPath}`);
        // Add streak columns if they don't exist
        yield ensureStreakColumns(db);
    });
}
function ensureStreakColumns(db) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if columns exist by querying table info
            const tableInfo = yield db.all("PRAGMA table_info(users)");
            const hasCurrentStreak = tableInfo.some((col) => col.name === 'current_streak');
            const hasLastActionDate = tableInfo.some((col) => col.name === 'last_action_date');
            // Add columns if missing
            if (!hasCurrentStreak) {
                yield db.exec('ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0');
                console.log('✅ Added current_streak column to users table');
            }
            if (!hasLastActionDate) {
                yield db.exec('ALTER TABLE users ADD COLUMN last_action_date DATE');
                console.log('✅ Added last_action_date column to users table');
            }
        }
        catch (error) {
            console.error('Error ensuring streak columns:', error);
            // Don't throw - let the app continue even if this fails
        }
    });
}
function dbRun(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Executes a query that does not return rows (INSERT, UPDATE, DELETE).
        // Returns the result from the 'run' operation (e.g., lastID, changes).
        const db = yield getDb();
        const result = params ? yield db.run(sql, params) : yield db.run(sql);
        // The 'sqlite' wrapper returns an object with lastID and changes
        return result;
    });
}
function dbGet(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Executes a query that returns a single row.
        // Returns the row object or undefined.
        const db = yield getDb();
        const row = params ? yield db.get(sql, params) : yield db.get(sql);
        return row;
    });
}
function dbAll(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Executes a query that returns multiple rows.
        // Returns an array of row objects.
        const db = yield getDb();
        const rows = params ? yield db.all(sql, params) : yield db.all(sql);
        return rows;
    });
}
