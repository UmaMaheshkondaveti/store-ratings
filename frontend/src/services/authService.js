// src/services/authService.js

export const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return response.json(); // Assuming your API returns a token
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return fetch('/api/logout', { method: 'POST' });
  };
  
  // ✅ NEW: Check if user is authenticated
  export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  // ✅ NEW: Get user role from localStorage
  export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null;
  };
      