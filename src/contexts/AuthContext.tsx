import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { me } from '../services/auth';
import { api } from '../services/api';

export const AUTH_TOKEN_KEY = 'MMOMarket_Access_Cookie';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);
    try {
      if (value) {
        localStorage.setItem(AUTH_TOKEN_KEY, value);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => setToken(null), [setToken]);

  // Sync with storage changes (e.g., other tabs)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
  if (e.key === AUTH_TOKEN_KEY) {
        setTokenState(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Server-side cookie validation
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) return; // nothing to validate
      try {
        await me();
      } catch (e: any) {
        // check for 401/403
        if (!cancelled) {
          setToken(null);
          // force redirect (HashRouter)
          if (window.location.hash !== '#/auth') {
            window.location.hash = '#/auth';
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token, setToken]);

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
              setToken(null); // clear token
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
  }, [setToken]);

  const value: AuthContextValue = {
    token,
    isAuthenticated: !!token,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
