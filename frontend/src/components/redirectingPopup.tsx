import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectingPopupProps {
    active: boolean;
    text: string;
    target?: string;
}
export default function RedirectingPopup({ active, text, target = "/home" }: RedirectingPopupProps) {
    const [timeoutState, setTimeoutState] = useState(false);
    const navigate = useNavigate();

    if (active && !timeoutState) {
        setTimeout(() => {
            navigate(target);
        }, 3000)
        setTimeoutState(true);
    }
    if (!active) return null;
    return (
        <div className="fixed top-5 right-2/3 bg-green-500 text-white px-4 py-3 rounded shadow-lg animate-fade-in">
            {text}
        </div>
    );
}