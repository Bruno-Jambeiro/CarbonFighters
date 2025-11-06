import { Pool } from 'pg';

let pool: Pool | null = null;

export function resetPool(): void {
    pool = null;
}

export function getDb(): Pool {
    if (!pool) {
        // Use test database configuration when running tests
        const isTest = process.env.NODE_ENV === 'test';
        const dbPort = isTest 
            ? parseInt(process.env.DB_PORT_TEST || '5433')
            : parseInt(process.env.DB_PORT || '5432');
        
        const dbName = isTest
            ? (process.env.DB_DATABASE_TEST || 'carbonfighters_test')
            : process.env.DB_DATABASE;

        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: dbName,
            password: process.env.DB_PASSWORD,
            port: dbPort,
        });

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });

        // Log connection info in test mode for debugging
        if (isTest) {
            console.log(`Connected to test database: ${dbName} on port ${dbPort}`);
            console.log(`Using credentials: user=${process.env.DB_USER}, host=${process.env.DB_HOST}`);
        }
    }
    return pool;
}

export async function query(text: string, params?: any[]) {
    const client = await getDb().connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}