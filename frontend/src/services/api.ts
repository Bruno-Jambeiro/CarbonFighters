const API_URL = 'http://localhost:3000';

export interface RegisterData {
  firstName: string;
  lastName: string;
  cpf: string;
  email?: string;
  phone?: string;
  birthday?: string;
  password: string;
}

export interface LoginData {
  cpf?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    email?: string;
    phone?: string;
    birthday?: string;
  };
}


export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return response.json();
  },
  
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return response.json();
  },
};

export const saveAuthData = (token: string, user: AuthResponse['user']) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


const apiClient = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: unknown
) => {
  const { token } = getAuthData();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // No token found, user should be logged out
    console.error('No token found for authenticated request');
    clearAuthData();
    // Force a reload to login page
    // NOTE: might cause problems redirecting unexpectedly, change later if needed (possible code smell)
    window.location.href = '/login';
    throw new Error('User not authenticated.');
  }
  
  const config: RequestInit = {
    method: method,
    headers: headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    // Token is invalid or expired
    console.error('Authentication failed (401)');
    clearAuthData();
    // NOTE: might cause problems redirecting unexpectedly, change later if needed (possible code smell)
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  
  if (!response.ok) {
    const errorData = await response.json();
    // Use errorData.message from backend
    throw new Error(errorData.message || `API request failed: ${response.status}`);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Groups interfaces
export interface Group {
  id: number;
  name: string;
  owner_id: number;
  invite_code: string;
  created_at: string;
}

export interface GroupMember {
  user_id: number;
  group_id: number;
  joined_at: string;
}

export interface GroupAction {
  id: number;
  activity_type: string;
  activity_title: string;
  activity_description: string;
  activity_date: string;
  user_id: number;
  firstName: string;
  lastName: string;
  image: string;
  validated: boolean;
}

// Actions interfaces
export interface SustainableAction {
  id: number;
  user_id: number;
  action_type: ActionType;
  description: string;
  carbon_saved: number;
  points: number;
  action_date: string;
  created_at: string;
}

export type ActionType = 'transport' | 'recycling' | 'water' | 'energy' | 'food' | 'other';

export interface ActionStats {
  total_actions: number;
  total_carbon_saved: number;
  total_points: number;
  current_streak: number;
}

export interface LogActionData {
  action_type: ActionType;
  description: string;
  carbon_saved?: number;
  points?: number;
}

// Badge interfaces
export interface Badge {
  id: number;
  name: string;
  description: string;
  type: BadgeType;
  icon: string;
  requirement: number;
  requirement_type: string;
  category?: string;
  points: number;
  created_at: string;
  earned_at?: string;
}

export type BadgeType = 'streak' | 'milestone' | 'special' | 'category';

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  badge_id?: number;
  is_read: boolean;
  created_at: string;
  icon?: string;
  badge_name?: string;
}

// --- NEW GROUP API ---

export const groupApi = {
  /**
   * Fetches all groups for the currently logged-in user.
   * Corresponds to: GET /groups/my-groups
   */
  getMyGroups: (): Promise<Group[]> => {
    return apiClient('/groups/my-groups', 'GET');
  },

  /**
   * Creates a new group.
   * Corresponds to: POST /groups
   */
  createGroup: (name: string): Promise<Group> => {
    return apiClient('/groups', 'POST', { name });
  },

  /**
   * Joins an existing group using an invite code.
   * Corresponds to: POST /groups/join
   */
  joinGroup: (inviteCode: string): Promise<{ message: string, membership: GroupMember }> => {
    return apiClient('/groups/join', 'POST', { inviteCode });
  },

  /**
   * Fetches all actions by members of a specific group.
   * Corresponds to: GET /groups/:groupId/actions
   */
  getGroupActions: (groupId: number): Promise<GroupAction[]> => {
    return apiClient(`/groups/${groupId}/actions`, 'GET');
  },
};

// --- ACTIONS API ---

export const actionApi = {
  /**
   * Logs a new sustainable action
   * Corresponds to: POST /actions
   */
  logAction: (data: LogActionData): Promise<{
    message: string;
    action: SustainableAction;
    stats: ActionStats
  }> => {
    return apiClient('/actions', 'POST', data);
  },

  /**
   * Gets all actions for the current user
   * Corresponds to: GET /actions
   */
  getMyActions: (): Promise<{ actions: SustainableAction[]; count: number }> => {
    return apiClient('/actions', 'GET');
  },

  /**
   * Gets stats for the current user (including current streak)
   * Corresponds to: GET /actions/stats
   */
  getMyStats: (): Promise<ActionStats> => {
    return apiClient('/actions/stats', 'GET');
  },
};

// --- BADGES API ---

export const badgeApi = {
  /**
   * Gets all available badges
   * Corresponds to: GET /badges
   */
  getAllBadges: (): Promise<{ badges: Badge[] }> => {
    return apiClient('/badges', 'GET');
  },

  /**
   * Gets badges earned by the current user
   * Corresponds to: GET /badges/my-badges
   */
  getMyBadges: (): Promise<{ badges: Badge[]; count: number }> => {
    return apiClient('/badges/my-badges', 'GET');
  },

  /**
   * Gets notifications for the current user
   * Corresponds to: GET /badges/notifications
   */
  getMyNotifications: (unreadOnly: boolean = false): Promise<{
    notifications: Notification[];
    unreadCount: number
  }> => {
    const query = unreadOnly ? '?unread=true' : '';
    return apiClient(`/badges/notifications${query}`, 'GET');
  },

  /**
   * Marks a notification as read
   * Corresponds to: PUT /badges/notifications/:id/read
   */
  markNotificationAsRead: (notificationId: number): Promise<{ message: string }> => {
    return apiClient(`/badges/notifications/${notificationId}/read`, 'PUT');
  },

  /**
   * Marks all notifications as read
   * Corresponds to: PUT /badges/notifications/read-all
   */
  markAllNotificationsAsRead: (): Promise<{ message: string }> => {
    return apiClient('/badges/notifications/read-all', 'PUT');
  },
};
export interface Action {
    id: number;
    activity_type: string;
    activity_title: string;
    activity_description: string;
    activity_date: string;
    image: string;
    validated: boolean;
}

export const actionsApi = {
    /**
     * Fetches all actions for the currently logged-in user.
     * Corresponds to: GET /actions/my-actions
     */
    getMyActions: (): Promise<Action[]> => {
        return apiClient('/actions/my-actions', 'GET');
    },

    /**
     * Creates a new action with file upload using FormData.
     * Corresponds to: POST /action
     */
    createAction: async (activity_type: string, activity_title: string, activity_description: string, activity_date: Date, imageFile: File): Promise<Action> => {
        const { token } = getAuthData();

        if (!token) {
            clearAuthData();
            window.location.href = '/login';
            throw new Error('User not authenticated.');
        }

        const formData = new FormData();
        formData.append('activity_type', activity_type);
        formData.append('activity_title', activity_title);
        formData.append('activity_description', activity_description);
        formData.append('activity_date', activity_date.toISOString());
        formData.append('image', imageFile);

        const response = await fetch(`${API_URL}/actions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.status === 401) {
            clearAuthData();
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API request failed: ${response.status}`);
        }

        return response.json();
    },

};

// --- USER PROFILE & STREAK API ---

export interface StreakInfo {
    current_streak: number;
    last_action_date: string | null;
    is_active: boolean;
}

export interface StreakWarning {
    warning: boolean;
    daysRemaining: number;
}

export interface StreakDetails extends StreakInfo {
    warning: StreakWarning;
    grace_period_days: number;
    message: string;
}

export interface UserStats {
    totalActions: number;
    actionsByCategory: Record<string, number>;
    recentActions: Action[];
}

export interface UserProfile {
    streak: StreakInfo & { warning: StreakWarning };
    stats: UserStats;
    badges: number;
    badgesList: Badge[];
    groups: number;
}

export const userApi = {
    /**
     * Gets comprehensive user profile
     * Corresponds to: GET /user/profile
     */
    getProfile: (): Promise<UserProfile> => {
        return apiClient('/user/profile', 'GET');
    },

    /**
     * Gets detailed streak information
     * Corresponds to: GET /user/streak
     */
    getStreak: (): Promise<StreakDetails> => {
        return apiClient('/user/streak', 'GET');
    },

    /**
     * Gets user activity statistics
     * Corresponds to: GET /user/stats
     */
    getStats: (): Promise<UserStats> => {
        return apiClient('/user/stats', 'GET');
    },
};

