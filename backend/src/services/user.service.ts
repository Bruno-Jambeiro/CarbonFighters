import { User } from '../models/user.model';
import { query } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    const result = await query('SELECT * FROM users;');
    return result.rows;
}

export async function getUser(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1;', [email]);
    return result.rows[0] || null;
}

export async function getUserByCpf(cpf: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE cpf = $1;', [cpf]);
    return result.rows[0] || null;
}

export async function createUser(user: Omit<User, 'id_user' | 'created_at'>): Promise<User | null> {
    const result = await query(
        `INSERT INTO users (firstName, lastName, cpf, email, phone, birthday, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [user.firstName, user.lastName, user.cpf, user.email, user.phone, user.birthday, user.password]
    );

    return result.rows[0] || null;
}

