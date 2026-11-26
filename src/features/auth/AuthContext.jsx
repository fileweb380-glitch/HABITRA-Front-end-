
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

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    localStorage.setItem('habitra_token', data.token);
    setUser(data);

    return data;
  };

  const register = async (name, email, password, timezone) => {
    return await authService.register(
      name,
      email,
      password,
      timezone
    );
  };

  const resendVerification = async (email) => {
    return await authService.resendVerification(email);
  };

  const verifyFirebaseEmail = async (email) => {
    const data = await authService.verifyFirebaseEmail(email);
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('habitra_token');
    setUser(null);

    await authService.logoutFirebase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        resendVerification,
        verifyFirebaseEmail,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
                                                                                                                                                                                                                                                                                                            