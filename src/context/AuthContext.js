import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';
import socketService from '../config/socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Connect to socket
        socketService.connect(token);
        
        // Verify token is still valid
        await api.get('/auth/profile');
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData, message } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      
      // Connect to socket
      socketService.connect(token);

      return { 
        success: true, 
        user: userData, 
        message,
        redirectPath: userData.roleName === 'admin' ? '/admin' : '/'
      };
    } catch (error) {
      console.error('Login failed:', error);
      
      const message = error.response?.data?.details?.[0]?.msg || error.response?.data?.msg || error.response?.data?.error || 'Đăng nhập thất bại';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user: newUser, message } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Connect to socket
      socketService.connect(token);

      return { 
        success: true, 
        user: newUser, 
        message,
        redirectPath: newUser.roleName === 'admin' ? '/admin' : '/'
      };
    } catch (error) {
      console.error('Registration failed:', error);
      
      const message = error.response?.data?.details?.[0]?.msg || error.response?.data?.msg || error.response?.data?.error || 'Đăng ký thất bại';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Disconnect socket
    socketService.disconnect();
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const { user: updatedUser } = response.data;
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      
      const message = error.response?.data?.details?.[0]?.msg || error.response?.data?.msg || error.response?.data?.error || 'Cập nhật thất bại';
      return { success: false, error: message };
    }
  };

  const isAdmin = () => {
    return user?.roleName === 'admin';
  };

  const isUser = () => {
    return user?.roleName === 'user';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};