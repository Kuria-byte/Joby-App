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

class AuthService {
  private baseURL = '/api/auth';
  private tokenKey = 'joby_auth_token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/login`, credentials);
      this.setToken(response.data.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response?.status === 429) {
          throw new Error('Too many login attempts. Please try again later');
        }
      }
      throw new Error('Login failed. Please try again');
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      const response = await axios.post(`${this.baseURL}/signup`, credentials);
      this.setToken(response.data.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Email already exists');
        }
        if (error.response?.status === 400) {
          throw new Error('Invalid signup information');
        }
      }
      throw new Error('Signup failed. Please try again');
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/logout`);
    } finally {
      this.removeToken();
    }
  }

  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      await axios.get(`${this.baseURL}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch {
      this.removeToken();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

export const authService = new AuthService();
