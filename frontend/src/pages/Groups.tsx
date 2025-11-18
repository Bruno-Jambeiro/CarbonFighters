import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupApi, getAuthData } from '../services/api';
import type { Group, AuthResponse } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Page component for creating, joining, and viewing groups.
 */
function Groups() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  // State for the component
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the forms
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check authentication and fetch user's groups
  useEffect(() => {
    const { token, user: userData } = getAuthData();
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    fetchGroups();
  }, [navigate]);

  /**
   * Fetches the user's groups and updates the state.
   */
  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const groups = await groupApi.getMyGroups();
      setMyGroups(groups);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the submission of the "Create Group" form.
   */
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newGroupName.trim()) {
      setFormError('Group name is required.');
      return;
    }

    try {
      const newGroup = await groupApi.createGroup(newGroupName);
      setFormSuccess(`Successfully created group "${newGroup.name}"!`);
      setNewGroupName(''); // Clear input
      fetchGroups(); // Refresh the list
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  /**
   * Handles the submission of the "Join Group" form.
   */
  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!joinCode.trim()) {
      setFormError('Invite code is required.');
      return;
    }

    try {
      const result = await groupApi.joinGroup(joinCode);
      setFormSuccess(result.message);
      setJoinCode(''); // Clear input
      fetchGroups(); // Refresh the list
    } catch (err) {
      setFormError((err as Error).message);
    }
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
            Community Groups 🌍
          </h1>
          <p className="text-gray-600 mt-2">Join forces with others to fight carbon emissions together.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Forms Section --- */}
          <div className="space-y-6">
            {/* Create Group Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Group</h2>
              
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700">{formSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateGroup}>
                <div className="mb-6">
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="e.g., The Eco-Warriors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="h-5 w-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Group
                </button>
              </form>
            </div>

            {/* Join Group Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Join an Existing Group</h2>
              <form onSubmit={handleJoinGroup}>
                <div className="mb-6">
                  <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    id="inviteCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter 8-character code"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="h-5 w-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Join Group
                </button>
              </form>
            </div>
          </div>

          {/* --- My Groups List --- */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {myGroups.length} groups
              </span>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg text-gray-600">Loading your groups...</div>
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
                {myGroups.length > 0 ? (
                  myGroups.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-green-700 mb-2">{group.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <button 
                                onClick={() => {
                                  // Toggle visibility logic would go here
                                  const element = document.getElementById(`code-${group.id}`);
                                  if (element) {
                                    element.textContent = element.textContent === '••••••' ? group.invite_code : '••••••';
                                  }
                                }}
                                className="flex items-center focus:outline-none"
                              >
                                <svg className="h-4 w-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <span id={`code-${group.id}`} className="font-mono bg-gray-100 text-indigo-700 px-2 py-1 rounded">
                                ••••••
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Created: {new Date(group.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/groups/${group.id}`)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                          View
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Yet</h3>
                    <p className="text-gray-600 mb-4">Create your first group or join an existing one to get started!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Community Stats */}
        {/* Righ now its just for visualization, doesnt do anything*/}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-8 mt-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Community Impact</h2>
              <p className="text-purple-100">Together we're making a difference!</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-sm text-purple-100">Total Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">256</p>
                  <p className="text-sm text-purple-100">Active Groups</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Groups;