import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getToken, getUserId, clearAuth } from '../api/authUtils';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = getToken();
    const savedUserId = getUserId();
    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  const login = (newToken: string, newUserId: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    storage.setItem('user_id', newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
