import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthData, groupApi } from '../services/api';
import type { AuthResponse, GroupAction } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function GroupView() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [groupActions, setGroupActions] = useState<GroupAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupActions = async () => {
    if (!groupId) return;

    try {
      setIsLoading(true);
      setError(null);
      const actions = await groupApi.getGroupActions(parseInt(groupId, 10));
      setGroupActions(actions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { token, user: userData } = getAuthData();

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(userData);
    fetchGroupActions();
  }, [navigate, groupId]);

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Helper function to get action type info
  const getActionTypeInfo = (type: string) => {
    const types: { [key: string]: { label: string; emoji: string; color: string } } = {
      transport: { label: 'Sustainable Transport', emoji: '🚲', color: 'bg-blue-500' },
      energy: { label: 'Energy Conservation', emoji: '⚡', color: 'bg-yellow-500' },
      waste: { label: 'Waste Reduction', emoji: '♻️', color: 'bg-green-500' },
      food: { label: 'Sustainable Food', emoji: '🌱', color: 'bg-purple-500' },
      water: { label: 'Water Conservation', emoji: '💧', color: 'bg-blue-400' },
      other: { label: 'Other Eco-Action', emoji: '🌍', color: 'bg-gray-500' },
    };
    return types[type] || types.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Navbar user={user} />

      {/* Chat-like Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/groups')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Group Activity Feed</h1>
              <p className="text-sm text-gray-500">{groupActions.length} actions</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/activities')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            + Post Action
          </button>
        </div>
      </div>

      {/* Chat-like Messages Feed */}
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 py-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-600">Loading actions...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {groupActions.length > 0 ? (
              <div className="space-y-4">
                {[...groupActions].reverse().map((action) => {
                  const isOwnAction = action.user_id === user.id;
                  const actionType = getActionTypeInfo(action.activity_type);

                  return (
                    <div
                      key={action.id}
                      className={`flex ${isOwnAction ? 'justify-end' : 'justify-start'} w-full`}
                    >
                      <div className={`flex gap-3 max-w-2xl ${isOwnAction ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${actionType.color} flex items-center justify-center text-white font-semibold text-lg`}>
                          {isOwnAction ? user.firstName[0] : action.firstName[0]}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isOwnAction ? 'items-end' : 'items-start'}`}>
                          {/* Name and Time */}
                          <div className={`flex items-center gap-2 mb-1 ${isOwnAction ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-sm font-medium text-gray-700">
                              {isOwnAction ? 'You' : `${action.firstName} ${action.lastName}`}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(action.activity_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {/* Action Bubble */}
                          <div
                            className={`rounded-2xl p-4 shadow-md ${
                              isOwnAction 
                                ? 'bg-green-500 text-white rounded-tr-none' 
                                : 'bg-white text-gray-900 rounded-tl-none'
                            }`}
                            style={{ maxWidth: '450px' }}
                          >
                            {/* Action Type Badge */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xl ${isOwnAction ? '' : actionType.color + ' w-6 h-6 rounded-full flex items-center justify-center text-white text-sm'}`}>
                                {actionType.emoji}
                              </span>
                              <span className={`text-xs font-semibold ${isOwnAction ? 'text-green-100' : 'text-gray-600'}`}>
                                {actionType.label}
                              </span>
                              {action.validated && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isOwnAction ? 'bg-green-400 text-green-900' : 'bg-green-100 text-green-800'}`}>
                                  ✓ Verified
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className={`font-semibold mb-1 ${isOwnAction ? 'text-white' : 'text-gray-900'}`}>
                              {action.activity_title}
                            </h3>

                            {/* Description */}
                            <p className={`text-sm mb-3 ${isOwnAction ? 'text-green-50' : 'text-gray-600'}`}>
                              {action.activity_description}
                            </p>

                            {/* Image */}
                            {action.image && (
                              <div className="rounded-lg overflow-hidden">
                                <img
                                  src={`data:image/jpeg;base64,${action.image}`}
                                  alt={action.activity_title}
                                  className="w-full max-h-64 object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Actions Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to post an action in this group!</p>
                <button
                  onClick={() => navigate('/activities')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  Post Your First Action
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default GroupView;

