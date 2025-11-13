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
    id_user: number;
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
    // NOTE: might cause problems redirecting unexpectedly, chage later if needed (possible code smell)
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
    // NOTE: might cause problems redirecting unexpectedly, chage later if needed (possible code smell)
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
};