// Authentication handling for KrishiConnect
class Auth {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Set auth data
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear auth data
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Sign up new user
  async signup(userData) {
    try {
      const response = await fetch(`${this.baseURL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data = await response.json();
      this.setAuth(data.token, data.user);
      return { success: true, data };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      this.setAuth(data.token, data.user);
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  logout() {
    this.clearAuth();
    window.location.href = 'index.html';
  }

  // Get user profile
  async getProfile() {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${this.baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get profile');
      }

      const userData = await response.json();
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.message.includes('Unauthorized')) {
        this.clearAuth();
        window.location.href = 'signup.html';
      }
      throw error;
    }
  }

  // Make authenticated API request
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(url, { ...options, ...defaultOptions });
    
    if (response.status === 401) {
      this.clearAuth();
      window.location.href = 'signup.html';
      throw new Error('Authentication expired');
    }

    return response;
  }
}

// Initialize global auth instance
window.KrishiAuth = new Auth();

// Auto-redirect if user is already authenticated
document.addEventListener('DOMContentLoaded', function() {
  if (window.KrishiAuth.isAuthenticated()) {
    // If on auth page, redirect to dashboard
    if (window.location.pathname.includes('signup.html')) {
      window.location.href = 'dashboard.html';
    }
  } else {
    // If on protected page, redirect to auth
    const protectedPages = ['dashboard.html', 'products.html', 'waste.html', 'cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'signup.html';
    }
  }
});
