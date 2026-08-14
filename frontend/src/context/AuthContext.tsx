import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { getToken, getUserId, getRole, clearAuth } from '../api/authUtils';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userId: string, role: string, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [userId, setUserId] = useState<string | null>(getUserId());
  const [role, setRole] = useState<string | null>(getRole());

  const login = (newToken: string, newUserId: string, newRole: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    storage.setItem('user_id', newUserId);
    storage.setItem('role', newRole);
    setToken(newToken);
    setUserId(newUserId);
    setRole(newRole);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        role,
        isAuthenticated: !!token,
        isAdmin: role === 'admin',
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
