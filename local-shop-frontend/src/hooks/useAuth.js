import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, register, logout, fetchUser } = useAuthStore();
  return { user, token, isAuthenticated, login, register, logout, fetchUser };
};