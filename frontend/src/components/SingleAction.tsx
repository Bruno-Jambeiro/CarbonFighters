import React from 'react';

const actionTypes = [
  { value: 'transport', label: '🚲 Sustainable Transport', color: 'from-blue-500 to-cyan-500' },
  { value: 'energy', label: '⚡ Energy Conservation', color: 'from-yellow-500 to-orange-500' },
  { value: 'waste', label: '♻️ Waste Reduction', color: 'from-green-500 to-emerald-500' },
  { value: 'food', label: '🌱 Sustainable Food', color: 'from-purple-500 to-pink-500' },
  { value: 'water', label: '💧 Water Conservation', color: 'from-blue-400 to-blue-600' },
  { value: 'other', label: '🌍 Other Eco-Action', color: 'from-gray-500 to-gray-600' },
];

interface SingleActionProps {
  action: {
    id: number;
    activity_title: string;
    activity_description: string;
    activity_type: string;
    activity_date: string;
    image: string;
    validated: boolean;
  };
  userName?: string; // Optional: for displaying user name (e.g., "John Doe")
  isOwnAction?: boolean; // Optional: to style differently if it's the user's own action
}

const SingleAction: React.FC<SingleActionProps> = ({ action, userName, isOwnAction = false }) => {
  const getActionTypeInfo = (type: string) => {
    return actionTypes.find(at => at.value === type) || actionTypes[actionTypes.length - 1];
  };

  const actionTypeInfo = getActionTypeInfo(action.activity_type);

  return (
    <div className={`border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${isOwnAction ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {userName && (
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {userName}
            </p>
          )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.activity_title}</h3>
          <p className="text-gray-600 mb-3">{action.activity_description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{new Date(action.activity_date).toLocaleDateString()}</span>
          </div>
          {action.image && (
            <div className="mt-3">
              <img
                src={`data:image/jpeg;base64,${action.image}`}
                alt={action.activity_title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleAction;

