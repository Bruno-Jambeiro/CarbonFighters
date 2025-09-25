// @ts-ignore
const apiURL = import.meta.env.VITE_API_URL.replace(/\/$/, "") // Remove trailing slash
    || 'http://localhost:3000';

export const registerURL = `${apiURL}/auth/register`;
export const loginURL = `${apiURL}/auth/login`;
