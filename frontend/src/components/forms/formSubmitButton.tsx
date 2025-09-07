interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled?: boolean;
}

export default function formSubmitButton({ children, disabled = false }: ButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-md bg-green-500 px-4 py-3 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            {children}
        </button>)
}