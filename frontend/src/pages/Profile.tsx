// frontend/src/pages/Profile.tsx
import React, { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';
import FormInput from '../components/forms/formInput';
import FormSubmitButton from '../components/forms/formSubmitButton';
import { UserCircleIcon } from '@heroicons/react/24/solid'; // For the avatar

// Mock user data - you would fetch this from your API
const MOCK_USER = {
  firstName: '[First Name]',
  lastName: '[Last Name]',
  email: '[email]',
  phone: '[number]',
};

export default function Profile() {
  // --- 1. Layout State (Same as Dashboard.tsx) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // --- 2. Form States ---
  const [profileData, setProfileData] = useState({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // --- 3. Form Handlers ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
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
              <h2 className="mt-4 text-2xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h2>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
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