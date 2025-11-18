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

