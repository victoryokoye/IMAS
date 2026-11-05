import { useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { fetchCurrentStaff } from './useCurrentStaff';

const LOGIN_URL = '/api/v1/auth/login'; // assumed: same base path note as ME_URL

export function useLogin() {
  const setStaff = useAuthStore((s) => s.setStaff);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login({ email, password }) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }
      const staff = await fetchCurrentStaff();
      if (!staff) throw new Error('Could not load your account');
      setStaff(staff);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}