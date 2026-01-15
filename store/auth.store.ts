import { getCurrentUser } from '@/lib/appWrite';
import { User } from '@/type';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  fetchAuthenticatedUser: async() => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();

      if(user) set({isAuthenticated: true, user: user as User})

      else set({isAuthenticated: false, user: null})
    } catch (error) {
      console.log('Error fetching authenticated user', error);
      set({isAuthenticated: false, user: null})
    } finally {
      set({ isLoading: false });
    }
  }
}))

export default useAuthStore;
