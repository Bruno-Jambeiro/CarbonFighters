import { User } from '../models/user.model';
import { query } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    const result = await query('SELECT * FROM users;');
    return result.rows;
}

export async function getUser(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = ?;', [email]);
    return result.rows[0] || null;
}

export async function getUserByCpf(cpf: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE cpf = ?;', [cpf]);
    return result.rows[0] || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const result = await query(
        `INSERT INTO users (firstName, lastName, cpf, email, phone, birthday, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *;`,
        [user.firstName, user.lastName, user.cpf, user.email, user.phone, user.birthday, user.password]
    );

    return result.rows[0] || null;
}

