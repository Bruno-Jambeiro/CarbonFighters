import { User } from '../models/user.model';
import { dbAll, dbGet, dbRun } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    // Use dbAll and specify the return type
    const users = await dbAll<User>('SELECT * FROM users;');
    return users;
}

export async function getUser(email: string): Promise<User | null> {
    // Use dbGet and specify the return type
    const user = await dbGet<User>('SELECT * FROM users WHERE email = ?;', [email]);
    return user || null;
}

export async function getUserByCpf(cpf: string): Promise<User | null> {
    // Use dbGet
    const user = await dbGet<User>('SELECT * FROM users WHERE cpf = ?;', [cpf]);
    return user || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    // 1. Run the INSERT query
    const result = await dbRun(
        `INSERT INTO users (firstName, lastName, cpf, email, phone, birthday, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [user.firstName, user.lastName, user.cpf, user.email, user.phone, user.birthday, user.password]
    );

    // 2. Get the lastID from the result
    const newUserId = result.lastID;
    if (!newUserId) {
        return null;
    }

    // 3. Explicitly fetch the user we just created
    const newUser = await dbGet<User>('SELECT * FROM users WHERE id = ?;', [newUserId]);
    return newUser || null;
}