import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthData } from '../services/api';
import carbonFightersLogo from '../assets/carbonfighters.png';

interface NavbarProps {
    user: {
        firstName: string;
        lastName: string;
        email?: string;
    };
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        clearAuthData();
        navigate('/login');
    };

    const getInitials = () => {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

    return (
        <nav className="bg-white shadow-lg border-b-2 border-green-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <img src={carbonFightersLogo} alt="Carbon Fighters" className="h-8 w-8" />
                            </div>
                            <span className="text-xl font-bold text-green-900 hidden sm:block">
                                Carbon Fighters
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/profile"
                            className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            My Profile
                        </Link>
                        <Link
                            to="/activities"
                            className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Activities
                        </Link>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
                            >
                                <div className="h-9 w-9 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {getInitials()}
                                </div>
                                <svg
                                    className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        {user.email && (
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </div>
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </div>
                                    </Link>
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-2"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <div className="px-3 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {getInitials()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    {user.email && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/profile"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            My Profile
                        </Link>
                        <Link
                            to="/activities"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Activities
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
