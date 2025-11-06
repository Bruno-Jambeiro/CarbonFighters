// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface DashboardData {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    dailyStreak: number;
    ecoPoints: number;
    activeGroups: Array<{
        id: number;
        name: string;
        description: string;
        userRank?: number;
        daysLeft?: number;
        memberCount?: number;
    }>;
}

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    return;
                }

                const response = await fetch('http://localhost:3000/user/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const message = `Failed to fetch dashboard data (${response.status})`;
                    console.error(message);
                    setError(message);
                    return; // instead of `throw`
                }

                const data = await response.json();
                setDashboardData(data);

            } catch (err) {
                console.error('Unexpected error fetching dashboard data:', err);
                setError('An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!dashboardData) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">No dashboard data available.</p>
            </div>
        );
    }

    const userName = dashboardData.user.firstName;
    const pointsToNextBadge = 1300 - dashboardData.ecoPoints;

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <DashboardHeader onToggleSidebar={toggleSidebar} />
            
            {/* 2. Sidebar (controlled by state) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* 3. Main Content (The "Hub") */}
            <main className="flex-grow p-6 overflow-auto">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Your Dashboard, {userName}!
                </h1>
                
                {/* Dashboard Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Example Widget 1: Status (Streak/Points) */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-600 pl-4">
                            Your Progress
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-around gap-4">
                            {/* Daily Streak Card */}
                            <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="text-center">
                                    <span className="text-5xl font-bold text-orange-600">🔥 {dashboardData.dailyStreak}</span>
                                    <p className="text-gray-700 font-semibold mt-2">Daily Streak</p>
                                    <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
                                </div>
                            </div>
                            {/* Eco Points Card */}
                            <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="text-center">
                                    <span className="text-5xl font-bold text-green-600">🌱 {dashboardData.ecoPoints.toLocaleString()}</span>
                                    <p className="text-gray-700 font-semibold mt-2">Eco Points</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {pointsToNextBadge > 0 ? `${pointsToNextBadge} more for a badge!` : 'Congratulations!'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example Widget 2: Main CTA */}
                    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center row-span-1 lg:row-span-2">
                        <h2 className="text-2xl font-semibold mb-4">Ready for action?</h2>
                        <p className="text-center mb-6 text-green-50">Log a new sustainable action and earn points!</p>
                        <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-green-50 hover:scale-105 transition-all duration-200 shadow-lg">
                            Log Action
                        </button>
                    </div>

                    {/* Example Widget 3: My Groups */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-600 pl-4">
                            My Active Groups
                        </h2>
                        {dashboardData.activeGroups.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.activeGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                                    {group.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {group.userRank && group.daysLeft
                                                        ? `You're in ${group.userRank}${group.userRank === 1 ? 'st' : group.userRank === 2 ? 'nd' : group.userRank === 3 ? 'rd' : 'th'} place! (${group.daysLeft} day${group.daysLeft !== 1 ? 's' : ''} left)`
                                                        : group.memberCount
                                                        ? `${group.memberCount} active member${group.memberCount !== 1 ? 's' : ''}`
                                                        : group.description
                                                    }
                                                </p>
                                            </div>
                                            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No active groups yet. Join one to get started!</p>
                        )}
                        <button className="mt-6 w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 hover:scale-105 hover:shadow-lg transition-all duration-200">
                            Join New Groups
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}