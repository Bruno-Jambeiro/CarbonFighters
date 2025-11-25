/**
 * Badges Page - Factory Pattern Demo
 * 
 * This page demonstrates the Factory Pattern implementation
 * by displaying example badges created using the BadgeFactory.
 * 
 * Academic Assignment: AvaliacaoA4
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, badgeApi, type Badge, type BadgeType } from '../services/api';
//import HeaderDash from '../components/headers/HeaderDash';
import FooterDash from '../components/footer/FooterDash';
import Navbar from '../components/Navbar';

export default function Badges() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<BadgeType | 'all'>('all');

  useEffect(() => {
    // Get user from localStorage
    const { token, user: userData } = getAuthData();
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadBadges();
  }, [navigate]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      // 4.2 CA1 & CA4: Load all available badges from the API
      const allBadgesData = await badgeApi.getAllBadges();
      setAllBadges(allBadgesData.badges);

      // 4.2 CA2 & CA4: Load badges earned by the user
      const myBadgesData = await badgeApi.getMyBadges();
      setUserBadges(myBadgesData.badges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4.2 CA4: Filter badges based on the selected type
  const filteredBadges = selectedType === 'all' 
    ? allBadges 
    : allBadges.filter((badge: Badge) => badge.type === selectedType);

  const getBadgeTypeColor = (type: BadgeType): string => {
    const colors: Record<BadgeType, string> = {
      'streak': 'bg-orange-100 text-orange-800 border-orange-300',
      'milestone': 'bg-green-100 text-green-800 border-green-300',
      'special': 'bg-purple-100 text-purple-800 border-purple-300',
      'category': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[type];
  };

  const getBadgeTypeName = (type: BadgeType): string => {
    const names: Record<BadgeType, string> = {
      'streak': 'Streak',
      'milestone': 'Milestone',
      'special': 'Special',
      'category': 'Category'
    };
    return names[type];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const totalPoints = userBadges.reduce((sum, badge) => sum + badge.points, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Navbar user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* User's Earned Badges Section */}
        {userBadges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🎖️</span>
                  My Earned Badges
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.name || user?.email || 'Usuario'} - {userBadges.length} badge{userBadges.length !== 1 ? 's' : ''} earned
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-3xl font-bold text-green-600">{totalPoints}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {userBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-yellow-400 relative"
                >
                  {/* Earned Badge Ribbon */}
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>✓</span> EARNED
                  </div>

                  {/* Badge Header */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center pt-6">
                    <div className="text-6xl mb-2 animate-bounce">{badge.icon}</div>
                    <h3 className="text-white font-bold text-lg">{badge.name}</h3>
                  </div>

                  {/* Badge Body */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 min-h-[60px]">
                      {badge.description}
                    </p>

                    {/* Badge Type Tag */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeTypeColor(badge.type)}`}>
                        {getBadgeTypeName(badge.type)}
                      </span>
                    </div>

                    {/* Date Earned */}
                    {badge.created_at && (
                      <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
                        <span>📅</span>
                        <span>Earned on {formatDate(badge.created_at)}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Requirement</p>
                        <p className="text-gray-900 font-bold">{badge.requirement}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Points</p>
                        <p className="text-green-600 font-bold text-lg">{badge.points}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Info */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Keep going!</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    You've earned {userBadges.length} out of {allBadges.length} available badges. 
                    Continue performing sustainable actions to unlock more!
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">
                        {Math.round((userBadges.length / allBadges.length) * 100)}% complete
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">
                        {allBadges.length - userBadges.length} badges remaining
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Available Badges Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📚 All Available Badges
          </h2>

          {/* Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Todos ({allBadges.length})
          </button>
          {/* CA4: Filtros por tipo de badge */}
          {(['streak', 'milestone', 'special', 'category'] as BadgeType[]).map((type) => {
            const count = allBadges.filter((b: Badge) => b.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {getBadgeTypeName(type)} ({count})
              </button>
            );
          })}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge, index) => {
            const isEarned = userBadges.some(ub => ub.name === badge.name);
            return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border ${
                isEarned ? 'border-green-400 ring-2 ring-green-200' : 'border-gray-200'
              } relative`}
            >
              {/* Earned indicator */}
              {isEarned && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                  ✓
                </div>
              )}
              {/* Badge Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center">
                <div className="text-6xl mb-2">{badge.icon}</div>
                <h3 className="text-white font-bold text-lg">{badge.name}</h3>
              </div>

              {/* Badge Body */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 min-h-[60px]">
                  {badge.description}
                </p>

                {/* Badge Type Tag */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeTypeColor(badge.type)}`}>
                    {getBadgeTypeName(badge.type)}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Requisito</p>
                    <p className="text-gray-900 font-bold">{badge.requirement}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Pontos</p>
                    <p className="text-green-600 font-bold text-lg">{badge.points}</p>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>

          {/* Empty State */}
          {filteredBadges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No badges found in this category
              </p>
            </div>
          )}
        </div>

        {/* Badge Types Info - User-Friendly Guide */}
        <div className="mt-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden border border-indigo-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏅</span>
              <h2 className="text-2xl font-bold">How to Earn Badges</h2>
            </div>
            <p className="text-indigo-100">Complete sustainable actions and earn points across 4 different badge types!</p>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* STREAK */}
              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg">
                <div className="text-5xl flex-shrink-0">🔥</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Streak Badges</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Build daily habits! Log sustainable actions every day to maintain your streak.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">•</span>
                      <span className="text-gray-700">7 days = <strong>70 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">•</span>
                      <span className="text-gray-700">30 days = <strong>300 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">•</span>
                      <span className="text-gray-700">100 days = <strong>1000 points</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MILESTONE */}
              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <div className="text-5xl flex-shrink-0">🏆</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Milestone Badges</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Reach action goals! Complete sustainable actions and unlock achievements.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      <span className="text-gray-700">10 actions = <strong>10 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      <span className="text-gray-700">100 actions = <strong>100 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      <span className="text-gray-700">500+ actions = <strong>500+ points</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIAL */}
              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <div className="text-5xl flex-shrink-0">⭐</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Special Event Badges</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Join special events! Participate in limited-time challenges and campaigns.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">•</span>
                      <span className="text-gray-700">Earth Day = <strong>500 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">•</span>
                      <span className="text-gray-700">Zero Waste Week = <strong>750 points</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">•</span>
                      <span className="text-gray-700">And more seasonal events!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <div className="text-5xl flex-shrink-0">🎖️</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Category Specialist</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Become an expert! Focus on specific sustainability categories.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">🚲 Green Transport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">♻️ Recycling Master</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">💧 Water Guardian, ⚡ Energy Hero</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Start Your Sustainability Journey Today! 🌱</h3>
              <p className="text-green-100">
                Every small action counts. Log your eco-friendly activities and watch your badge collection grow!
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterDash />
    </div>
  );
}
