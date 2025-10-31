// frontend/src/components/navigation/Sidebar.tsx
// import React from 'react';
import { Link } from 'react-router-dom';

import { 
  HomeIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CheckBadgeIcon,
  UserIcon, 
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void; // Function to close sidebar (ex: when clicking outside or X)
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Dark overlay for opened sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar content */}
      <nav 
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-green-900">Navigation</h2>
          <button onClick={onClose} className="text-gray-600 p-1">✕</button>
        </div>
        
        <ul className="flex flex-col p-4 space-y-2">
          {/* Use 'Link' of react-router-dom */}
          <li>
            <Link to="/dashboard" className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
              <HomeIcon className="h-5 w-5" />
              Home Page
            </Link>
          </li>
          <li>
            <Link to="/groups" className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
              <UsersIcon className="h-5 w-5" />
              My Groups
            </Link>
          </li>
          <li>
            <Link to="/leaderboards" className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
              <ChartBarIcon className="h-5 w-5" />
              Leaderboards
            </Link>
          </li>
          <li>
            <Link to="/achievements" className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
              <CheckBadgeIcon className="h-5 w-5" />
              Achievements
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700">
              <UserIcon className="h-5 w-5" />
              Profile
            </Link>
          </li>
          <li className="pt-4 border-t">
             <Link to="/logout" className="flex items-center gap-3 p-2 rounded-md text-red-600 hover:bg-red-50">
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}