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
    console.log(row);
    return row || null;
};

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const db = await getDb();

    await db.run(
        'INSERT INTO users (full_name, email, phone, password, date_of_birth) VALUES (?, ?, ?, ?, ?);',
        [user.full_name, user.email, user.phone, user.password, user.date_of_birth]
    );

    return await getUser(user.email);
};
