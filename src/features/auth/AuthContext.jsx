     
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { authService } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user when the app loads
  useEffect(() => {
    const token = localStorage.getItem('habitra_token');

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => {
        // No email verification requirement.
        setUser(data);
      })
      .catch((error) => {
        console.error('Session restoration failed:', error);

        localStorage.removeItem('habitra_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  // LOGIN
  const login = async (email, password) => {
    const data = await authService.login(email, password);

    if (!data?.token) {
      throw new Error('Authentication token was not returned.');
    }

    localStorage.setItem('habitra_token', data.token);
    setUser(data);

    return data;
  };

  // REGISTER
  const register = async (name, email, password, timezone) => {
    const data = await authService.register(
      name,
      email,
      password,
      timezone
    );

    if (!data?.token) {
      throw new Error('Account created, but authentication token was not returned.');
    }

    localStorage.setItem('habitra_token', data.token);
    setUser(data);

    return data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('habitra_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
                                                                                                                                                                                                                                             