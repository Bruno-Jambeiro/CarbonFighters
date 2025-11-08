import { getDb, resetDb } from "../src/services/db.service";

beforeAll(async () => {
    // Reset the database to ensure we use test configuration
    await resetDb();
    
    // Initialize in-memory database with schema
    const db = await getDb();
    
    try {
        // The tables are already created by initializeDatabase in db.service.ts
        // We just need to ensure they're clean for tests
        
        // Clean existing data
        await db.exec('DELETE FROM users;');
        
        console.log('✅ Test database initialized');
    } catch (error) {
        console.error('❌ Error setting up test database:', error);
        throw error;
    }
});

afterAll(async () => {
    // Close database connection
    await resetDb();
});