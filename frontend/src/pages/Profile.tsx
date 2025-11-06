// frontend/src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import { UserCircleIcon } from '@heroicons/react/24/solid'; // For the avatar

interface DashboardResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function Profile() {
  // --- 1. Layout State (Same as Dashboard.tsx) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Loading and error state for fetching profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 2. Form States ---
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // not stored in backend for now
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const res = await fetch('http://localhost:3000/user/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const message = `Failed to fetch profile (${res.status})`;
          console.error(message);
          setError(message);
          return;
        }

        const data: DashboardResponse = await res.json();
        setProfileData((prev) => ({
          ...prev,
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          email: data.user.email || '',
        }));
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- 3. Form Handlers ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating profile with:', profileData);
    // TODO: Add API call to update profile
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating password...');
    // TODO: Add API call to update password
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
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

  // --- 4. JSX Rendering ---
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* --- Layout Components (Same as Dashboard.tsx) --- */}
      <DashboardHeader onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* --- Main Profile Content --- */}
      <main className="flex-grow p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Profile Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Column 1: Avatar Card --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
              <UserCircleIcon className="h-32 w-32 text-gray-300" />
              <h2 className="mt-4 text-2xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`.trim()}</h2>
              <p className="text-gray-500">{profileData.email}</p>
              <button className="mt-6 w-full bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">
                Change Photo
              </button>
            </div>
          </div>

          {/* --- Column 2: Form Cards --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- Profile Details Form --- */}
            <form
              className="bg-white p-8 rounded-lg shadow-md"
              onSubmit={handleProfileSubmit}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="firstName"
                  name="First Name"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  autoComplete="given-name"
                />
                <FormInput
                  id="lastName"
                  name="Last Name"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  autoComplete="family-name"
                />
                <FormInput
                  id="email"
                  name="Email Address"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  autoComplete="email"
                />
                <FormInput
                  id="phone"
                  name="Phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  autoComplete="tel"
                />
              </div>
              <div className="mt-8 text-right">
                <FormSubmitButton>Save Profile</FormSubmitButton>
              </div>
            </form>

            {/* --- Change Password Form --- */}
            <form
              className="bg-white p-8 rounded-lg shadow-md"
              onSubmit={handlePasswordSubmit}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Change Password
              </h2>
              <div className="space-y-6">
                <FormInput
                  id="currentPassword"
                  name="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
                <FormInput
                  id="newPassword"
                  name="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
                <FormInput
                  id="confirmPassword"
                  name="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="mt-8 text-right">
                <FormSubmitButton>Update Password</FormSubmitButton>
              </div>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
}