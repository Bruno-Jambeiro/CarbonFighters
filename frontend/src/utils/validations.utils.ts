export function validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];
    if (typeof password !== 'string' || password.length < 8)
        errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password))
        errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password))
        errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password))
        errors.push("Password must contain at least one digit");
    if (!/[^a-zA-Z0-9]/.test(password))
        errors.push("Password must contain at least one special character");
    return errors;
}

export function validateEmailFormat(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email))
        return "Invalid email format";
    return null;
}

export function validateDate(rawValue: string): string | null {
    const cleaned = rawValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return 'Please enter a complete date (DD/MM/YYYY)';

    const day = parseInt(cleaned.slice(0, 2), 10);
    const month = parseInt(cleaned.slice(2, 4), 10);
    const year = parseInt(cleaned.slice(4, 8), 10);

    if (month < 1 || month > 12) return 'Month must be between 01 and 12';
    if (day < 1 || day > 31) return 'Day must be between 01 and 31';
    if (year < 1900 || year > 9999) return 'Year must be between 1900 and 9999';

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return `Day ${day} is invalid for month ${month}`;

    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return 'Invalid date';
    }

    return null;
}