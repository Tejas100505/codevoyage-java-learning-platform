import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('codevoyage_jwt'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('codevoyage_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('codevoyage_jwt');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
      localStorage.setItem('codevoyage_user', JSON.stringify(profile));
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout();
      } else {
        console.warn('Unable to reach auth server; retaining local cadet session', err);
        const cached = localStorage.getItem('codevoyage_user');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // Non-blocking JSON error
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('codevoyage_jwt', newToken);
    localStorage.setItem('codevoyage_user', JSON.stringify(newUser));
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
