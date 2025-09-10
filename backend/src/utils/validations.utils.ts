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
    // Require at least one dot in the domain and a TLD of at least 2 characters
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (
        typeof email !== 'string' ||
        !emailRegex.test(email) ||
        email.startsWith('@') ||
        email.endsWith('@') ||
        email.includes('..') ||
        email.includes(',') ||
        email.split('@').length !== 2
    ) {
        return "Invalid email format";
    }
    // Check TLD length (last part after the last dot)
    const domainParts = email.split('@')[1].split('.');
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
        return "Invalid email format";
    }
    return null;
}