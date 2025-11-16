import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthData, actionApi, type ActionStats, type SustainableAction, type ActionType, type LogActionData } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<ActionStats>({
        total_actions: 0,
        total_carbon_saved: 0,
        total_points: 0,
        current_streak: 0
    });
    const [recentActions, setRecentActions] = useState<SustainableAction[]>([]);
    const [showLogModal, setShowLogModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { token, user: userData } = getAuthData();    
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }
        
        setUser(userData);
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            // Cargar estadísticas (AC2: mostrar racha visualmente)
            const statsData = await actionApi.getMyStats();
            setStats(statsData);

            // Cargar acciones recientes
            const { actions } = await actionApi.getMyActions();
            setRecentActions(actions.slice(0, 5)); // Últimas 5 acciones
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handler para registrar una acción
    const handleLogAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const actionData: LogActionData = {
            action_type: formData.get('action_type') as ActionType,
            description: formData.get('description') as string,
            carbon_saved: parseFloat(formData.get('carbon_saved') as string) || 0,
            points: parseInt(formData.get('points') as string) || 10,
        };

        try {
            await actionApi.logAction(actionData);
            setShowLogModal(false);
            // Recargar datos
            await loadUserData();
            // Resetear formulario
            e.currentTarget.reset();
        } catch (error) {
            console.error('Error logging action:', error);
            alert('Error al registrar la acción. Por favor intenta de nuevo.');
        }
    };

    const getActionTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            transport: '🚲',
            recycling: '♻️',
            water: '💧',
            energy: '⚡',
            food: '🍎',
            other: '🌱'
        };
        return icons[type] || '🌱';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    };

    if (!user || loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
            <Navbar user={user} />
            
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, {user.firstName} {user.lastName}! 🌱
                    </h1>
                    <p className="text-gray-600 mt-2">Track your carbon footprint and make a difference today.</p>
                </div>

                {/* AC2: Mostrar racha visualmente */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* NUEVO: Card de Racha */}
                    <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">🔥 Current Streak</p>
                                <p className="text-5xl font-bold mt-2">{stats.current_streak}</p>
                                <p className="text-orange-100 text-xs mt-1">consecutive days</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <span className="text-5xl">🔥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Carbon Saved</p>
                                <p className="text-3xl font-bold mt-2">{stats.total_carbon_saved.toFixed(1)} kg</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Activities</p>
                                <p className="text-3xl font-bold mt-2">{stats.total_actions}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Points</p>
                                <p className="text-3xl font-bold mt-2">{stats.total_points}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-full p-3">
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">CPF</p>
                            <p className="text-lg font-semibold text-gray-900">{user.cpf}</p>
                        </div>
                        {user.email && (
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                            </div>
                        )}
                        {user.phone && (
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                            </div>
                        )}
                        {user.birthday && (
                            <div>
                                <p className="text-sm text-gray-600">Birthday</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(user.birthday).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Badges Showcase - NEW FEATURE! */}
                <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 opacity-20">
                        <div className="text-9xl">🏆</div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl animate-bounce">🎖️</span>
                            <h2 className="text-3xl font-bold">Your Earned Badges!</h2>
                        </div>
                        
                        <p className="text-yellow-100 mb-6 text-lg">
                            You've earned <strong className="text-white">3 badges</strong> with a total of <strong className="text-white">670 points</strong>! 🎉
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Badge 1 */}
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border-2 border-white border-opacity-40 hover:bg-opacity-30 transition-all">
                                <div className="text-center">
                                    <div className="text-5xl mb-2">🔥</div>
                                    <h3 className="font-bold text-white mb-1">7 Days Streak</h3>
                                    <p className="text-xs text-yellow-100 mb-2">7 consecutive days</p>
                                    <div className="bg-yellow-300 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full inline-block">
                                        +70 pts
                                    </div>
                                </div>
                            </div>

                            {/* Badge 2 */}
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border-2 border-white border-opacity-40 hover:bg-opacity-30 transition-all">
                                <div className="text-center">
                                    <div className="text-5xl mb-2">🌱</div>
                                    <h3 className="font-bold text-white mb-1">Eco Rookie</h3>
                                    <p className="text-xs text-yellow-100 mb-2">100 actions completed</p>
                                    <div className="bg-green-300 text-green-900 text-sm font-bold px-3 py-1 rounded-full inline-block">
                                        +100 pts
                                    </div>
                                </div>
                            </div>

                            {/* Badge 3 */}
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border-2 border-white border-opacity-40 hover:bg-opacity-30 transition-all">
                                <div className="text-center">
                                    <div className="text-5xl mb-2">⭐</div>
                                    <h3 className="font-bold text-white mb-1">Earth Day 2025</h3>
                                    <p className="text-xs text-yellow-100 mb-2">Special event</p>
                                    <div className="bg-purple-300 text-purple-900 text-sm font-bold px-3 py-1 rounded-full inline-block">
                                        +500 pts
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-sm text-yellow-100">
                                <strong className="text-white">3/12 badges</strong> earned • <strong className="text-white">25%</strong> complete
                            </div>
                            <Link 
                                to="/badges"
                                className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-yellow-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                            >
                                View All Badges
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => setShowLogModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Log Activity
                        </button>

                        <Link 
                            to="/badges"
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-center"
                        >
                            <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            My Badges
                            
                        </Link>

                        <Link 
                            to="/groups"
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            <svg className="h-6 w-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Groups
                            
                        </Link>
                        
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
                        <div className="space-y-4">
                            {recentActions.length === 0 ? (
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                                    <div className="bg-green-500 rounded-full p-2">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">No activities yet</h3>
                                        <p className="text-sm text-gray-600 mt-1">Start logging your eco-friendly actions!</p>
                                        <p className="text-xs text-gray-500 mt-2">Get started by clicking "Log Activity" above</p>
                                    </div>
                                </div>
                            ) : (
                                recentActions.map((action) => (
                                    <div key={action.id} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                        <div className="text-3xl">{getActionTypeIcon(action.action_type)}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-gray-900 capitalize">{action.action_type}</h3>
                                                <span className="text-xs text-gray-500">{formatDate(action.action_date)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                                            <div className="flex gap-3 mt-2 text-xs">
                                                {action.carbon_saved > 0 && (
                                                    <span className="text-green-600 font-medium">
                                                        💨 {action.carbon_saved.toFixed(1)}kg CO₂
                                                    </span>
                                                )}
                                                <span className="text-purple-600 font-medium">
                                                    ⭐ {action.points} pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Tips</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <svg className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Use reusable bags</h3>
                                    <p className="text-sm text-gray-600 mt-1">Reduce plastic waste by bringing your own bags when shopping.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <svg className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Save energy</h3>
                                    <p className="text-sm text-gray-600 mt-1">Turn off lights and unplug devices when not in use.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                <svg className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Reduce water usage</h3>
                                    <p className="text-sm text-gray-600 mt-1">Take shorter showers and fix leaky faucets.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Challenge */}
                <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl shadow-lg p-8 mt-8 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">🏆 Weekly Challenge</h2>
                            <p className="text-orange-100">Log 5 eco-friendly activities this week!</p>
                            <div className="mt-4">
                                <div className="bg-white bg-opacity-20 rounded-full h-3 w-64">
                                    <div className="bg-white rounded-full h-3 w-0"></div>
                                </div>
                                <p className="text-sm mt-2 text-orange-100">0 / 5 activities completed</p>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-4">
                            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Modal for logging sustainable action */}
                {showLogModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Log Sustainable Action</h2>
                                <button
                                    onClick={() => setShowLogModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleLogAction} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Action Type
                                    </label>
                                    <select
                                        name="action_type"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="transport">🚲 Transport</option>
                                        <option value="recycling">♻️ Recycling</option>
                                        <option value="water">💧 Water Conservation</option>
                                        <option value="energy">⚡ Energy Saving</option>
                                        <option value="food">🍎 Sustainable Food</option>
                                        <option value="other">🌱 Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={3}
                                        placeholder="Describe what you did..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CO₂ Saved (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="carbon_saved"
                                            step="0.1"
                                            min="0"
                                            defaultValue="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Points
                                        </label>
                                        <input
                                            type="number"
                                            name="points"
                                            min="1"
                                            defaultValue="10"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowLogModal(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium shadow-md hover:shadow-lg"
                                    >
                                        Log Action
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
