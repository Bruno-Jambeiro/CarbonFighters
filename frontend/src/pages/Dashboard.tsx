// frontend/src/pages/Dashboard.tsx
import { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
// Import future widgets:
// import StreakWidget from '../components/widgets/StreakWidget';
// import GroupsWidget from '../components/widgets/GroupsWidget';
// import CtaWidget from '../components/widgets/CtaWidget';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Mock user name - replace with actual user data from context/auth
    const userName = "[User name]";

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                                    <span className="text-5xl font-bold text-orange-600">🔥 5</span>
                                    <p className="text-gray-700 font-semibold mt-2">Daily Streak</p>
                                    <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
                                </div>
                            </div>
                            {/* Eco Points Card */}
                            <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="text-center">
                                    <span className="text-5xl font-bold text-green-600">🌱 1,200</span>
                                    <p className="text-gray-700 font-semibold mt-2">Eco Points</p>
                                    <p className="text-sm text-gray-500 mt-1">100 more for a badge!</p>
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
                        {/* You can .map() over your group data here */}
                        <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                            "Plastic-Free Week" Challenge
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">You're in 2nd place! (3 days left)</p>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                                </div>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                            "Meatless Monday" Club
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">15 active members</p>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 hover:scale-105 hover:shadow-lg transition-all duration-200">
                            Join New Groups
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}