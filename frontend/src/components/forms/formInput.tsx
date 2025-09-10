import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"

interface TextInputProps {
    id: string;
    name: string;
    type?: string;
    autoComplete?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    formatter?: (value: string) => string;
}

export default function FormInput({
    id,
    name,
    type = 'text',
    autoComplete,
    value,
    onChange,
    placeholder,
    error,
    formatter
}: TextInputProps) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    let displayValue = formatter ? formatter(value) : value;

    function togglePasswordVisibility() {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 text-left">
                {name}
            </label>
            <div className="relative w-full">
                <input
                    id={id}
                    name={id}
                    type={type === 'password' && isPasswordVisible ? 'text' : type}
                    autoComplete={autoComplete}
                    value={displayValue}
                    onChange={onChange}
                    placeholder={placeholder || name}
                    className={`
                        w-full bg-white rounded-md border-2 px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 
                        focus:border-green-500 focus:ring-2 focus:ring-green-500
                        ${error ? 'border-red-500' : 'border-green-500'}
                    `}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
