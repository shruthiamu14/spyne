import React, { createContext, useState, useEffect } from 'react';
import axios from '../Api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({}); // Fetch user if needed
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  };

  const register = async (username, email, password) => {
    await axios.post('/api/auth/register', { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    window.location.href = '/'; // Redirect to login page
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
