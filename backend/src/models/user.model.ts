export interface User {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    email?: string;
    phone?: string;
    birthday?: string;
    password: string;
    created_at: string;
}
