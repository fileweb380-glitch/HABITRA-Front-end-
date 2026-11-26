
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

                      if (token) {
                            authService.getMe()
                                    .then(data => {
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

                                                                                                                                                                                                                                            const logout = () => {
                                                                                                                                                                                                                                                localStorage.removeItem('habitra_token');
                                                                                                                                                                                                                                                    setUser(null);
                                                                                                                                                                                                                                                      };

                                                                                                                                                                                                                                                        return (
                                                                                                                                                                                                                                                            <AuthContext.Provider
                                                                                                                                                                                                                                                                  value={{
                                                                                                                                                                                                                                                                          user,
                                                                                                                                                                                                                                                                                  login,
                                                                                                                                                                                                                                                                                          register,
                                                                                                                                                                                                                                                                                                  logout,
                                                                                                                                                                                                                                                                                                          resendVerification,
                                                                                                                                                                                                                                                                                                                  loading
                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                                  {children}
                                                                                                                                                                                                                                                                                                                                      </AuthContext.Provider>
                                                                                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                                                                                                        };

                                                                                                                                                                                                                                                                                                                                        export const useAuth = () => useContext(AuthContext);
                                                                                                                                                                                                                                                                                                                                        