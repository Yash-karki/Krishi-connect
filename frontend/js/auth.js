// Authentication handling for KrishiConnect
class Auth {
  constructor() {
    // Use relative URL for API calls to work with the current server setup
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
      console.log('Attempting signup with:', { ...userData, password: '[HIDDEN]' });
      
      const response = await fetch(`${this.baseURL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Signup failed: ${response.status}`);
      }

      console.log('Signup successful:', { ...data, token: '[HIDDEN]' });
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
      console.log('Attempting login with:', { ...credentials, password: '[HIDDEN]' });
      
      const response = await fetch(`${this.baseURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status}`);
      }

      console.log('Login successful:', { ...data, token: '[HIDDEN]' });
      this.setAuth(data.token, data.user);
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  logout() {
    console.log('Logging out user');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Profile fetch failed: ${response.status}`);
      }

      const userData = await response.json();
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
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
      console.log('Token expired, redirecting to login');
      this.clearAuth();
      window.location.href = 'signup.html';
      throw new Error('Authentication expired');
    }

    return response;
  }

  // Validate token on page load
  async validateToken() {
    if (!this.token) {
      return false;
    }

    try {
      await this.getProfile();
      return true;
    } catch (error) {
      console.log('Token validation failed:', error.message);
      this.clearAuth();
      return false;
    }
  }
}

// Initialize global auth instance
window.KrishiAuth = new Auth();

// Auto-redirect if user is already authenticated
document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM loaded, checking authentication status');
  
  const isAuthenticated = await window.KrishiAuth.validateToken();
  
  if (isAuthenticated) {
    console.log('User is authenticated, checking page access');
    // If on auth page, redirect to dashboard
    if (window.location.pathname.includes('signup.html')) {
      console.log('Redirecting from auth page to dashboard');
      window.location.href = 'dashboard.html';
    }
  } else {
    console.log('User is not authenticated, checking page access');
    // If on protected page, redirect to auth
    const protectedPages = ['dashboard.html', 'waste.html', 'cart.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      console.log('Redirecting from protected page to auth');
      window.location.href = 'signup.html';
    }
  }
});





