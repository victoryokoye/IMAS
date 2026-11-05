import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  staff: null,
  status: 'loading',
  setStaff: (staff) => set({ staff, status: 'authenticated' }),
  clear: () => set({ staff: null, status: 'unauthenticated' }),
}));