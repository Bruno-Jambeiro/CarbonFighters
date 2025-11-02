import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import Navbar from '../components/Navbar';

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

    if (!user) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
            <Navbar user={user} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-4xl font-bold text-green-900 mb-6">
                        Welcome back, {user.firstName}! 🎉
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Stats Cards */}
                        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Carbon Saved</p>
                                    <p className="text-3xl font-bold mt-2">0 kg</p>
                                </div>
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Activities</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Impact Score</p>
                                    <p className="text-3xl font-bold mt-2">0</p>
                                </div>
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                        <h2 className="font-semibold text-green-900 mb-4 text-xl">Your Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">CPF</p>
                                <p className="text-gray-900 font-medium">{user.cpf}</p>
                            </div>
                            {user.email && (
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            )}
                            {user.phone && (
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900 font-medium">{user.phone}</p>
                                </div>
                            )}
                            {user.birthday && (
                                <div>
                                    <p className="text-sm text-gray-500">Birthday</p>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(user.birthday).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-3 text-lg">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="bg-white hover:bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-lg border-2 border-blue-300 transition-colors flex items-center justify-center gap-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Log Activity
                            </button>
                            <button className="bg-white hover:bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-lg border-2 border-green-300 transition-colors flex items-center justify-center gap-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Stats
                            </button>
                            <button className="bg-white hover:bg-purple-50 text-purple-700 font-semibold py-3 px-4 rounded-lg border-2 border-purple-300 transition-colors flex items-center justify-center gap-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Find Friends
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
