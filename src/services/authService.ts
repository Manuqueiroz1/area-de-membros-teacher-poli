// Use environment variable for API URL or fallback to proxy
const API_BASE_URL = '/api';

export interface User {
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface PurchaseCheckResponse {
  hasPurchase: boolean;
  customerName?: string;
  purchaseDate?: string;
  error?: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Check if email has valid Hotmart purchase
  async checkPurchase(email: string): Promise<PurchaseCheckResponse> {
    try {
      console.log('Checking purchase for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/check-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('Purchase check failed:', response.status, response.statusText);
        return {
          hasPurchase: false,
          error: `Erro na verificação: ${response.status}`
        };
      }

      const data = await response.json();
      console.log('Purchase check response:', data);
      return data;
    } catch (error) {
      console.error('Check purchase error:', error);
      return {
        hasPurchase: false,
        error: 'Erro de conexão com o servidor'
      };
    }
  }

  // Create password for first-time user
  async createPassword(email: string, password: string, name?: string): Promise<LoginResponse> {
    try {
      console.log('Creating password for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/create-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        console.error('Create password failed:', response.status, response.statusText);
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erro ao criar senha'
        };
      }

      const data = await response.json();
      console.log('Create password response:', data);

      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Create password error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      };
    }
  }

  // Login with existing credentials
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Logging in:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Login failed:', response.status, response.statusText);
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erro no login'
        };
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      };
    }
  }

  // Complete onboarding
  async completeOnboarding(email: string): Promise<boolean> {
    try {
      console.log('Completing onboarding for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('Complete onboarding failed:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('Complete onboarding response:', data);
      return data.success;
    } catch (error) {
      console.error('Complete onboarding error:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Simulate purchase for testing
  async simulatePurchase(email: string, name: string): Promise<boolean> {
    try {
      console.log('Simulating purchase for:', email, name);
      const response = await fetch(`${API_BASE_URL}/simulate-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        console.error('Simulate purchase failed:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('Simulate purchase response:', data);
      return data.success;
    } catch (error) {
      console.error('Simulate purchase error:', error);
      return false;
    }
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const authService = new AuthService();