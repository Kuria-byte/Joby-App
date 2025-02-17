import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Simple authentication functions
export const login = (email: string, password: string): Promise<boolean> => {
    // Here you can implement your login logic
    // For now, we will just simulate a successful login
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });
};

export const logout = (): void => {
    // Implement logout logic here (e.g., clear tokens)
    console.log('User logged out');
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/api/login', credentials);
    return response.data as AuthResponse;
  },
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/api/signup', credentials);
    return response.data as AuthResponse;
  },
  authenticate: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/api/authenticate', credentials);
    return response.data as AuthResponse;
  }
};
