import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (error) {
          console.error("Login failed:", error);
          throw error.response?.data?.message || 'Login failed';
        }
      },
      register: async (userData) => {
         try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (error) {
          console.error("Registration failed:", error);
          throw error.response?.data?.message || 'Registration failed';
        }
      },
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error("Logout failed on server, but logging out client-side:", error);
        } finally {
            set({ user: null, token: null, isAuthenticated: false });
        }
      },
      fetchUser: async () => {
        if (!get().isAuthenticated) return;
        try {
          const { data } = await api.get('/users/me');
          set({ user: data.data });
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // If token is invalid, log out
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);