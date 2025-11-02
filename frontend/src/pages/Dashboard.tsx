import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, clearAuthData } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const { token, user: userData } = getAuthData();
        
        if (!token || !userData) {
            // If no auth data, redirect to login
            navigate('/login');
            return;
        }
        
        setUser(userData);
    }, [navigate]);

    const handleLogout = () => {
        clearAuthData();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-4xl font-bold text-green-900 mb-6">
                    Welcome back, {user.firstName} {user.lastName}! 🎉
                </h1>
                <div className="space-y-4 text-left">
                    <p className="text-lg text-gray-800">
                        You are successfully logged in to CarbonFighters.
                    </p>
                    
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                        <h2 className="font-semibold text-green-900 mb-2">Your Profile:</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li><strong>Name:</strong> {user.firstName} {user.lastName}</li>
                            <li><strong>CPF:</strong> {user.cpf}</li>
                            {user.email && <li><strong>Email:</strong> {user.email}</li>}
                            {user.phone && <li><strong>Phone:</strong> {user.phone}</li>}
                            {user.birthday && <li><strong>Birthday:</strong> {new Date(user.birthday).toLocaleDateString()}</li>}
                        </ul>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
