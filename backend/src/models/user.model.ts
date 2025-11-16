export interface User {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    email?: string;
    phone?: string;
    birthday?: string;
    password: string;
    current_streak?: number;
    last_action_date?: string;
    created_at: string;
}
