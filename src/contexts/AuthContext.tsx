import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { me } from '../services/auth';
import { api } from '../services/api';

// Cookie-only session: не храним токен в localStorage
export type AuthStatus = 'checking' | 'auth' | 'guest';

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('checking');

  const refreshSession = useCallback(async () => {
    try {
      await me();
      setStatus('auth');
    } catch {
      setStatus('guest');
    }
  }, []);

  const logout = useCallback(async () => {
    setStatus('guest');
    if (window.location.hash !== '#/auth') {
      window.location.hash = '#/auth';
    }
  }, []);

  // Initial check
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Global interceptor to catch 401/403 across the app
  useEffect(() => {
    let redirecting = false;
    const id = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          const url: string = error?.config?.url || '';
          // ignore auth endpoints
          if (!url.includes('auth/login') && !url.includes('auth/register')) {
            if (!redirecting) {
              redirecting = true;
              setStatus('guest');
              // Direct redirect (HashRouter)
              if (window.location.hash !== '#/auth') {
                window.location.hash = '#/auth';
              }
              // Reset flag via tick to avoid spamming
              setTimeout(() => { redirecting = false; }, 0);
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(id);
    };
  }, []);

  const value: AuthContextValue = {
    status,
    isAuthenticated: status === 'auth',
    refreshSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
