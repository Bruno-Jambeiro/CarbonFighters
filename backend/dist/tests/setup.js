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
Object.defineProperty(exports, "__esModule", { value: true });
const db_service_1 = require("../src/services/db.service");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Reset the database to ensure we use test configuration
    yield (0, db_service_1.resetDb)();
    // Initialize in-memory database with schema
    const db = yield (0, db_service_1.getDb)();
    try {
        // The tables are already created by initializeDatabase in db.service.ts
        // We just need to ensure they're clean for tests
        // Clean existing data
        yield db.exec('DELETE FROM users;');
        console.log('✅ Test database initialized');
    }
    catch (error) {
        console.error('❌ Error setting up test database:', error);
        throw error;
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Close database connection
    yield (0, db_service_1.resetDb)();
}));
