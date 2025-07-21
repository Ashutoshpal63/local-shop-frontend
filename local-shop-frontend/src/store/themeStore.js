// src/store/themeStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light', 'dark', or 'system'

      // This function runs when the store is initialized
      applyTheme: () => {
        const currentTheme = get().theme;
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (currentTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(currentTheme);
        }
      },

      setTheme: (newTheme) => {
        set({ theme: newTheme });
        get().applyTheme(); // Apply the theme immediately after changing it
      },
    }),
    {
      name: 'theme-storage', // name of the item in localStorage
      onRehydrateStorage: () => (state) => {
        // This ensures the theme is applied as soon as the app loads
        if (state) {
          state.applyTheme();
        }
      },
    }
  )
);