import { create } from 'zustand';
import { authAPI } from './api';
import { initSocket, disconnectSocket } from './socket';
import type { User, AuthState } from './types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: () => {
    if (typeof window === 'undefined') { set({ isLoading: false }); return; }
    const token = localStorage.getItem('tot_token');
    const userStr = localStorage.getItem('tot_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ token, user, isAuthenticated: true, isLoading: false });
        initSocket(token);
      } catch {
        localStorage.removeItem('tot_token');
        localStorage.removeItem('tot_user');
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await authAPI.login(email, password);
    const { token, user } = data;
    localStorage.setItem('tot_token', token);
    localStorage.setItem('tot_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
    initSocket(token);
  },

  register: async (username, email, password) => {
    const { data } = await authAPI.register(username, email, password);
    const { token, user } = data;
    localStorage.setItem('tot_token', token);
    localStorage.setItem('tot_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
    initSocket(token);
  },

  logout: () => {
    authAPI.logout().catch(() => {});
    localStorage.removeItem('tot_token');
    localStorage.removeItem('tot_user');
    disconnectSocket();
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  setUser: (user) => {
    localStorage.setItem('tot_user', JSON.stringify(user));
    set({ user });
  },
}));
