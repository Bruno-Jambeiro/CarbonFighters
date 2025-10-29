import { User } from '../models/user.model';
import { getDb } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const rows = await db.all<User[]>('SELECT * FROM users;');
    return rows;
}

export async function getUser(email: string): Promise<User | null> {
    const db = await getDb();
    const row = await db.get<User>('SELECT * FROM users WHERE email = ?;', [email]);

    return row || null;
};

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const db = await getDb();

    await db.run(
        'INSERT INTO users (firstName, lastName, email,  password) VALUES (?, ?, ?, ?);',
        [user.firstName, user.lastName, user.email, user.password]
    );

    return await getUser(user.email);
};
