import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        setToken(localStorage.token);
        setAuthToken(localStorage.token);
      } else {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const googleLogin = async (credential, role = null) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, { credential, role });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true, isNewUser: res.data.isNewUser };
    } catch (err) {
      console.error('Google login error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Google login failed' };
    }
  };

  const updateRole = async (role) => {
    try {
      const res = await axios.put(`${API_URL}/api/auth/role`, { role });
      setUser(prev => ({ ...prev, role: res.data.role }));
      return { success: true };
    } catch (err) {
      console.error('Update role error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Failed to update role' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${API_URL}/api/auth/profile`, profileData);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Failed to update profile' };
    }
  };

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, googleLogin, updateRole, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
