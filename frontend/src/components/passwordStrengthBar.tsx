function evaluatePasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength
};

interface PasswordStrengthBarProps {
    password: string;
}

export default function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
    const passwordStrength = evaluatePasswordStrength(password);
    const strengthColors = ['bg-gray-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

    return (
        <div className="flex mt-1 space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
                <div
                    key={level}
                    className={`h-2 flex-1 rounded ${level <= passwordStrength
                        ? strengthColors[passwordStrength]
                        : "bg-gray-300"
                        }`}
                ></div>
            ))}
        </div>
    )

}