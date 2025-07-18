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
      const response = await fetch(`${API_BASE_URL}/auth/check-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check purchase error:', error);
      return {
        hasPurchase: false,
        error: 'Erro ao verificar compra'
      };
    }
  }

  // Create password for first-time user
  async createPassword(email: string, password: string, name?: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/create-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Create password error:', error);
      return {
        success: false,
        error: 'Erro ao criar senha'
      };
    }
  }

  // Login with existing credentials
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Erro ao fazer login'
      };
    }
  }

  // Complete onboarding
  async completeOnboarding(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
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
      const response = await fetch('/api/test/simulate-purchase', {
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

      const text = await response.text();
      if (!text) {
        console.error('Empty response from server');
        return false;
      }

      const data = JSON.parse(text);
      return data.success;
    } catch (error) {
      console.error('Simulate purchase error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();