import { User } from '../models/user.model';
import { query } from './db.service';


export async function getAllUsers(): Promise<User[]> {
    const result = await query('SELECT * FROM users;');
    return result.rows.map(mapDbUserToUser);
}

export async function getUser(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1;', [email]);
    return result.rows[0] ? mapDbUserToUser(result.rows[0]) : null;
}

export async function getUserByCpf(cpf: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE cpf = $1;', [cpf]);
    return result.rows[0] ? mapDbUserToUser(result.rows[0]) : null;
}

export async function createUser(user: Omit<User, 'id_user' | 'created_at'>): Promise<User | null> {
    const result = await query(
        `INSERT INTO users (first_name, last_name, cpf, email, phone, birthday, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [user.firstName, user.lastName, user.cpf, user.email, user.phone, user.birthday, user.password]
    );

    return result.rows[0] ? mapDbUserToUser(result.rows[0]) : null;
}

// Helper function to map database fields (snake_case) to TypeScript interface (camelCase)
function mapDbUserToUser(dbUser: any): User {
    return {
        id_user: dbUser.id_user,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        cpf: dbUser.cpf,
        email: dbUser.email,
        phone: dbUser.phone,
        birthday: dbUser.birthday,
        password: dbUser.password,
        created_at: dbUser.created_at,
    };
}

