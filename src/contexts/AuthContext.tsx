import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AdminUser } from '@/api/auth';
import { setToken, clearAuthToken } from '@/api/auth';

const STORAGE_KEY = 'snacqo_admin_auth';

interface AuthState {
  isLoggedIn: boolean;
  user: AdminUser | null;
}

interface AuthContextValue extends AuthState {
  setAuth: (state: { user: AdminUser; token: string }) => void;
  logout: () => void;
}

function loadStored(): { token: string; user: AdminUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { token: string; user: AdminUser };
      if (data?.token && data?.user) return data;
    }
  } catch {
    // ignore
  }
  return null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => loadStored()?.user ?? null);

  useEffect(() => {
    const stored = loadStored();
    if (stored?.token) {
      setToken(stored.token);
      setUser(stored.user);
    }
  }, []);

  const isLoggedIn = !!user;

  const setAuth = useCallback((next: { user: AdminUser; token: string }) => {
    setToken(next.token);
    setUser(next.user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: next.token, user: next.user }));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      user,
      setAuth,
      logout,
    }),
    [isLoggedIn, user, setAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
