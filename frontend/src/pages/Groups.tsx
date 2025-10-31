import { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';

export default function Groups() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <DashboardHeader onToggleSidebar={toggleSidebar} />

            {/* Sidebar (controlled by state) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main className="w-screen h-screen flex flex-col items-center justify-center">
                {/* Title */}
                <h1 className="text-4xl font-bold text-green-900 mb-6">
                    Your groups:
                </h1>

                <p className="text-lg text-gray-800 max-w-2xl mx-auto">
                    Group 1,
                    Group 2,
                    Group 3
                </p>
            </main>
        </div>
    );
}