import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodbridge_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('foodbridge_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('foodbridge_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (res) => {
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('foodbridge_token', receivedToken);
    localStorage.setItem('foodbridge_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    return handleAuthSuccess(res);
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    return handleAuthSuccess(res);
  };

  const demoLogin = async (role = 'donor') => {
    const res = await authAPI.demoLogin(role);
    return handleAuthSuccess(res);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isDonor: user?.role === 'donor',
        isNgo: user?.role === 'ngo',
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
