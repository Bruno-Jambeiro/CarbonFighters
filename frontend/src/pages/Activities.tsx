import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define action types
interface Action {
  id: number;
  title: string;
  description: string;
  actionType: string;
  carbonSaved: number;
  imageUrl?: string;
  createdAt: string;
  validated: boolean;
  validatedBy?: string;
}

const actionTypes = [
  { value: 'transport', label: '🚲 Sustainable Transport', color: 'from-blue-500 to-cyan-500' },
  { value: 'energy', label: '⚡ Energy Conservation', color: 'from-yellow-500 to-orange-500' },
  { value: 'waste', label: '♻️ Waste Reduction', color: 'from-green-500 to-emerald-500' },
  { value: 'food', label: '🌱 Sustainable Food', color: 'from-purple-500 to-pink-500' },
  { value: 'water', label: '💧 Water Conservation', color: 'from-blue-400 to-blue-600' },
  { value: 'other', label: '🌍 Other Eco-Action', color: 'from-gray-500 to-gray-600' },
];

function Activities() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // State for the component
  const [myActions, setMyActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the form
  const [actionTitle, setActionTitle] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('transport');
  const [carbonSaved, setCarbonSaved] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check authentication and fetch user's actions
  useEffect(() => {
    const { token, user: userData } = getAuthData();
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    fetchActions();
  }, [navigate]);

  /**
   * Fetches the user's actions and updates the state.
   */
  const fetchActions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data for demonstration
      const mockActions: Action[] = [
        {
          id: 1,
          title: "Bike to Work Week",
          description: "Used my bike instead of car for the entire week",
          actionType: "transport",
          carbonSaved: 12.5,
          createdAt: "2024-11-10",
          validated: true,
          validatedBy: "Community"
        },
        {
          id: 2,
          title: "Solar Panel Installation",
          description: "Installed solar panels on my rooftop",
          actionType: "energy",
          carbonSaved: 50.0,
          createdAt: "2024-11-08",
          validated: false
        }
      ];
      
      setMyActions(mockActions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the submission of the "Post New Action" form.
   */
  const handlePostAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation
    if (!actionTitle.trim()) {
      setFormError('Action title is required.');
      return;
    }
    if (!actionDescription.trim()) {
      setFormError('Action description is required.');
      return;
    }
    if (!carbonSaved || parseFloat(carbonSaved) <= 0) {
      setFormError('Please enter a valid carbon saved amount.');
      return;
    }

    try {
      // Here would be the API call to post the action
      // For now, just simulate success
      setFormSuccess(`Successfully posted action "${actionTitle}"!`);
      
      // Clear form
      setActionTitle('');
      setActionDescription('');
      setCarbonSaved('');
      setSelectedFile(null);
      setSelectedActionType('transport');
      
      // Refresh the list (in real app, this would refetch from API)
      fetchActions();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const getActionTypeInfo = (type: string) => {
    return actionTypes.find(at => at.value === type) || actionTypes[actionTypes.length - 1];
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Eco Actions 🌍
          </h1>
          <p className="text-gray-600 mt-2">Share your climate actions and inspire others to make a difference.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Post New Action Form --- */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Action</h2>
              
              {/* Form Status Messages */}
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700">{formError}</p>
                  </div>
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700">{formSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePostAction}>
                {/* Action Type */}
                <div className="mb-6">
                  <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-2">
                    Action Category
                  </label>
                  <select
                    id="actionType"
                    value={selectedActionType}
                    onChange={(e) => setSelectedActionType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    {actionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Title */}
                <div className="mb-6">
                  <label htmlFor="actionTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Action Title
                  </label>
                  <input
                    type="text"
                    id="actionTitle"
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Bike to Work Challenge"
                  />
                </div>

                {/* Action Description */}
                <div className="mb-6">
                  <label htmlFor="actionDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="actionDescription"
                    rows={4}
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe your eco-friendly action and its impact..."
                  />
                </div>

                {/* Carbon Saved */}
                <div className="mb-6">
                  <label htmlFor="carbonSaved" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Carbon Saved (kg CO₂)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="carbonSaved"
                    value={carbonSaved}
                    onChange={(e) => setCarbonSaved(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="0.0"
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label htmlFor="actionImage" className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="actionImage" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload a photo of your action
                        </span>
                        <input
                          id="actionImage"
                          name="actionImage"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="h-5 w-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Post Action
                </button>
              </form>
            </div>
          </div>

          {/* --- My Activities List --- */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Actions</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {myActions.length} actions
              </span>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg text-gray-600">Loading your actions...</div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && (
              <div className="space-y-4">
                {myActions.length > 0 ? (
                  myActions.map((action) => {
                    const actionTypeInfo = getActionTypeInfo(action.actionType);
                    return (
                      <div key={action.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${actionTypeInfo.color}`}>
                                {actionTypeInfo.label}
                              </span>
                              {action.validated ? (
                                <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                  ⏳ Pending
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                            <p className="text-gray-600 mb-3">{action.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                                {action.carbonSaved} kg CO₂ saved
                              </span>
                              <span>{new Date(action.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Actions Yet</h3>
                    <p className="text-gray-600 mb-4">Start making a difference by posting your first eco-action!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Community Activities Feed */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Actions Feed</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample community actions */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Composting Setup</h4>
              <p className="text-sm text-gray-600 mb-3">Started composting organic waste at home</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ♻️ Waste Reduction
                </span>
                <span className="text-xs text-gray-500">3.2 kg CO₂ saved</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Maria Johnson</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Plant-Based Week</h4>
              <p className="text-sm text-gray-600 mb-3">Completed a week of plant-based meals</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  🌱 Sustainable Food
                </span>
                <span className="text-xs text-gray-500">8.5 kg CO₂ saved</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AS
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Alex Smith</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">LED Upgrade</h4>
              <p className="text-sm text-gray-600 mb-3">Replaced all bulbs with LED lights</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  ⚡ Energy Conservation
                </span>
                <span className="text-xs text-gray-500">15.0 kg CO₂ saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Section */}
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl shadow-lg p-8 mt-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Monthly Challenge</h2>
              <p className="text-orange-100 mb-4">November 2024: "No Car November"</p>
              <p className="text-sm text-orange-100 mb-4">
                Use alternative transportation methods for the entire month!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">847</p>
                  <p className="text-sm text-orange-100">Participants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">2.1T</p>
                  <p className="text-sm text-orange-100">CO₂ Saved</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Activities;