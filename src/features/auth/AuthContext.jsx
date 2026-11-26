
 
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

  // Restore the logged-in user
  useEffect(() => {
    const token = localStorage.getItem('habitra_token');

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => {
        if (!data.isVerified) {
          localStorage.removeItem('habitra_token');
          setUser(null);
          return;
        }

        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('habitra_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login
  const login = async (email, password) => {
    const data = await authService.login(email, password);

    localStorage.setItem('habitra_token', data.token);
    setUser(data);

    return data;
  };

  // Register
  const register = async (name, email, password, timezone) => {
    return await authService.register(
      name,
      email,
      password,
      timezone
    );
  };

  // Verify email using backend token
  const verifyEmail = async (token, email) => {
    return await authService.verifyEmail(token, email);
  };

  // Resend verification email
  const resendVerification = async (email) => {
    return await authService.resendVerification(email);
  };

  // Logout
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
        verifyEmail,
        resendVerification,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
                                                                                                                                                                                                                                                                           