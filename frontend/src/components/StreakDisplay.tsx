import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import type { StreakDetails } from '../services/api';

/**
 * Streak Display Component
 * Shows user's current streak with visual feedback and warnings
 */
function StreakDisplay() {
  const [streak, setStreak] = useState<StreakDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      setLoading(true);
      const data = await userApi.getStreak();
      setStreak(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <p className="text-red-600">Error loading streak: {error}</p>
      </div>
    );
  }

  if (!streak) return null;

  const getStreakColor = () => {
    if (streak.current_streak === 0) return 'from-gray-400 to-gray-500';
    if (streak.current_streak < 7) return 'from-orange-400 to-red-500';
    if (streak.current_streak < 30) return 'from-yellow-400 to-orange-500';
    return 'from-purple-500 to-pink-500';
  };

  const getFlameAnimation = () => {
    if (!streak.is_active) return '';
    if (streak.current_streak < 7) return 'animate-pulse';
    if (streak.current_streak < 30) return 'animate-bounce';
    return 'animate-ping';
  };

  return (
    <div className={`bg-gradient-to-br ${getStreakColor()} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Your Streak</h3>
        <div className={`text-4xl ${getFlameAnimation()}`}>
          {streak.is_active ? '🔥' : '💨'}
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-6xl font-bold mb-2">
          {streak.current_streak}
        </div>
        <div className="text-lg opacity-90">
          {streak.current_streak === 1 ? 'Day' : 'Days'}
        </div>
      </div>

      {/* Message */}
      <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
        <p className="text-sm text-center">
          {streak.message}
        </p>
      </div>

      {/* Warning Banner */}
      {streak.warning.warning && (
        <div className="bg-yellow-500 text-yellow-900 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">
              {streak.warning.daysRemaining} {streak.warning.daysRemaining === 1 ? 'day' : 'days'} left!
            </span>
          </div>
          <p className="text-xs mt-1 opacity-90">
            Post an activity to maintain your streak
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs opacity-75">
          <span>Last activity</span>
          <span>
            {streak.last_action_date 
              ? new Date(streak.last_action_date).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
        
        {streak.is_active && !streak.warning.warning && (
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ 
                width: `${(streak.warning.daysRemaining / streak.grace_period_days) * 100}%` 
              }}
            />
          </div>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 text-xs opacity-75 text-center">
        <p>Post an activity every {streak.grace_period_days} days to maintain your streak</p>
      </div>
    </div>
  );
}

export default StreakDisplay;
