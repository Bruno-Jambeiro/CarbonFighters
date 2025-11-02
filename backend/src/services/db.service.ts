import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb(): Pool {
    if (!pool) {
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432'),
        });

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
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