// frontend/src/components/headers/DashboardHeader.tsx
// import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
// 1. Import Link from react-router-dom
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onToggleSidebar: () => void; 
}

export default function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        
        {/* Left: Hamburger Menu, Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button */}
          <button
            onClick={onToggleSidebar}
            className="text-gray-700 p-2 rounded-md hover:bg-green-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <img
            src="/logo.png"
            alt="CarbonFighters Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-3xl font-bold text-green-800">CarbonFighters</h1>
        </div>

        {/* Right: Profile Picture */}
        <Link to="/profile">
          <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
            {/* User image here */}
          </div>
        </Link>

      </div>
    </header>
  );
}