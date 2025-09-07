export function validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];
    if (typeof password !== 'string' || password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one digit");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>_\-+=~`[\]\\\/]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }
    return errors;
}

export function validateEmailFormat(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
        typeof email !== 'string' ||
        !emailRegex.test(email) ||
        email.split('@').length !== 2 ||
        email.startsWith('@') ||
        email.endsWith('@') ||
        email.indexOf('.') < email.indexOf('@') + 2 ||
        email.endsWith('.')
    ) {
        return "Invalid email format";
    }
    return null;
}