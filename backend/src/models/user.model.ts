export interface User {
    id_user: number;
    firstName: string;
    lastName: string;
    cpf: string;
    email?: string;
    phone?: string;
    birthday?: Date;
    password: string;
    created_at: Date;
}
