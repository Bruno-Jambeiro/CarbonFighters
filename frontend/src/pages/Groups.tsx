import { useState, useEffect } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/headers/DashboardHeader';

interface Group {
  id: number;
  name: string;
  description: string;
  userRank?: number;
  daysLeft?: number;
  memberCount?: number;
}

interface DashboardGroupsResponse {
  activeGroups: Group[];
}

export default function Groups() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchGroups = async () => {
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
          const message = `Failed to fetch groups (${res.status})`;
          console.error(message);
          setError(message);
          return;
        }

        const data: DashboardGroupsResponse = await res.json();
        setGroups(data.activeGroups || []);
      } catch (err) {
        console.error('Unexpected error fetching groups:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your groups...</p>
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

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <DashboardHeader onToggleSidebar={toggleSidebar} />

      {/* Sidebar (controlled by state) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-grow p-6 overflow-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-900 mb-6">Your Groups</h1>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-green-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{group.name}</h2>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  {typeof group.userRank === 'number' && (
                    <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      Rank: {group.userRank}
                    </span>
                  )}
                  {typeof group.memberCount === 'number' && (
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      Members: {group.memberCount}
                    </span>
                  )}
                  {typeof group.daysLeft === 'number' && (
                    <span className="inline-block bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                      {group.daysLeft} day{group.daysLeft !== 1 ? 's' : ''} left
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">You're not in any active groups yet.</p>
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition">
              Browse Groups
            </button>
          </div>
        )}
      </main>
    </div>
  );
}