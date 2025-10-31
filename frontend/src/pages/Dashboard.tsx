// frontend/src/pages/Dashboard.tsx
import { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';
// Import future widgets:
// import StreakWidget from '../components/widgets/StreakWidget';
// import GroupsWidget from '../components/widgets/GroupsWidget';
// import CtaWidget from '../components/widgets/CtaWidget';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Your Dashboard, [User Name]!
                </h1>
                
                {/* Dashboard Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Example Widget 1: Status (Streak/Points) */}
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-green-800">Your Progress</h2>
                        <div className="flex justify-around text-center">
                            <div>
                                <span className="text-4xl font-bold text-green-600">🔥 5</span>
                                <p className="text-gray-600">Daily Streak</p>
                            </div>
                            <div>
                                <span className="text-4xl font-bold text-green-600">ECO 1,200</span>
                                <p className="text-gray-600">Eco Points</p>
                            </div>
                        </div>
                    </div>

                    {/* Example Widget 2: Main CTA */}
                    <div className="bg-green-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center row-span-2">
                        <h2 className="text-2xl font-semibold mb-4">Ready for action?</h2>
                        <p className="text-center mb-6">Log a new sustainable action and earn points!</p>
                        <button className="bg-white text-green-700 font-bold py-3 px-6 rounded-full text-lg hover:bg-green-50">
                            Log Action
                        </button>
                    </div>

                    {/* Example Widget 3: My Groups */}
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Active Groups</h2>
                        {/* You can .map() over your group data here */}
                        <div className="space-y-4">
                            <div className="p-4 border rounded-md hover:shadow-lg transition-shadow">
                                <h3 className="font-semibold">"Plastic-Free Week" Challenge</h3>
                                <p className="text-sm text-gray-600">You're in 2nd place! (3 days left)</p>
                            </div>
                            <div className="p-4 border rounded-md hover:shadow-lg transition-shadow">
                                <h3 className="font-semibold">"Meatless Monday" Club</h3>
                                <p className="text-sm text-gray-600">15 active members</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}