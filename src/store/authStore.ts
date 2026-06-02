import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../api/auth';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User, refreshToken?: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      setAuth: (token, user, refreshToken) => {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        set({ token, user, refreshToken: refreshToken ?? get().refreshToken });
      },
      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        set({ token: null, user: null, refreshToken: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'stk-auth',
      partialize: (s) => ({ token: s.token, user: s.user, refreshToken: s.refreshToken }),
    },
  ),
);
