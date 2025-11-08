import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthday: '',
        cpf: ''
    });

    useEffect(() => {
        const { token, user: userData } = getAuthData();
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }
        
        setUser(userData);
        setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            birthday: userData.birthday || '',
            cpf: userData.cpf || ''
        });
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Aquí irá la lógica de guardado con el backend
        console.log('Saving profile data:', formData);
        setIsEditing(false);
        // TODO: Actualizar el localStorage y el estado del usuario
    };

    const handleCancel = () => {
        // Restaurar los datos originales
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                birthday: user.birthday || '',
                cpf: user.cpf || ''
            });
        }
        setIsEditing(false);
    };

    if (!user) {
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
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* User Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                                <p className="text-gray-600 mt-1">Carbon Fighter since {new Date(user.created_at || Date.now()).getFullYear()}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        🌱 Eco Warrior
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        ⭐ Level 1
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleCancel}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8 px-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'personal'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'security'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'preferences'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Preferences
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.firstName}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.lastName}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.email || 'Not provided'}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.phone || 'Not provided'}</p>
                                        )}
                                    </div>

                                    {/* CPF */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CPF
                                        </label>
                                        <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.cpf}</p>
                                        <p className="text-xs text-gray-500 mt-1">CPF cannot be changed</p>
                                    </div>

                                    {/* Birthday */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Birthday
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                                {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                
                                {/* Change Password */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                                        </div>
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all">
                                            Enable
                                        </button>
                                    </div>
                                </div>

                                {/* Active Sessions */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Current Session</p>
                                                    <p className="text-sm text-gray-600">Linux • Chrome • Brazil</p>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                                
                                {/* Notifications */}
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Email Notifications</p>
                                            <p className="text-sm text-gray-600">Receive updates about your activities</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Weekly Reports</p>
                                            <p className="text-sm text-gray-600">Get weekly summaries of your progress</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Challenge Reminders</p>
                                            <p className="text-sm text-gray-600">Get notified about new challenges</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Privacy */}
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Profile Visibility</p>
                                            <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Show Activity Stats</p>
                                            <p className="text-sm text-gray-600">Let others see your carbon savings</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Language & Region */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option>English</option>
                                                <option>Español</option>
                                                <option selected>Português</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Timezone
                                            </label>
                                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                <option selected>America/Sao_Paulo (GMT-3)</option>
                                                <option>America/New_York (GMT-5)</option>
                                                <option>Europe/London (GMT+0)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-red-900">Delete Account</h3>
                            <p className="text-sm text-red-700 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
