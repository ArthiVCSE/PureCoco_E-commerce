import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('purecoco_user');
    const token = localStorage.getItem('purecoco_token');
    // Avoid silently logging in demo or placeholder users on first visit.
    // If the stored token/user is one of the demo/local placeholders, clear it
    // so the site opens in a logged-out state by default.
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        const isDemo = token === 'demo-token' || parsed?._id === 'demo' || token === 'local-token';
        if (!isDemo) {
          setUser(parsed);
        } else {
          localStorage.removeItem('purecoco_token');
          localStorage.removeItem('purecoco_user');
        }
      } catch (e) {
        // corrupted entry — remove it to avoid unexpected auth state
        localStorage.removeItem('purecoco_token');
        localStorage.removeItem('purecoco_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('purecoco_token', data.token);
      localStorage.setItem('purecoco_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || 'Invalid credentials' };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('purecoco_token', data.token);
      localStorage.setItem('purecoco_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
