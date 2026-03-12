import { create } from 'zustand';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'aura2024';

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkSession: () => void;
}

export const CREDENTIALS = {
  username: ADMIN_USERNAME,
  password: ADMIN_PASSWORD,
};

export const useAdminAuth = create<AdminAuthState>((set) => ({
  isAuthenticated: sessionStorage.getItem('admin_auth') === 'true',
  login: (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    sessionStorage.removeItem('admin_auth');
    set({ isAuthenticated: false });
  },
  checkSession: () => {
    set({ isAuthenticated: sessionStorage.getItem('admin_auth') === 'true' });
  },
}));
