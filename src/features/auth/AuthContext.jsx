import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habitra_token');
    if (token) {
      authService.getMe()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('habitra_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('habitra_token', data.token);
    setUser(data);
    return data;
  };

const register = async (name, email, password, timezone) => {
    const data = await authService.register(name, email, password, timezone);
    localStorage.setItem('habitra_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('habitra_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);