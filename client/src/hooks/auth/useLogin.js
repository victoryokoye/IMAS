import { useState } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { MOCK_USERS, setMockSession } from './mockAuth'; // MOCK
// import { fetchCurrentStaff } from './useCurrentStaff'; // REAL

// const LOGIN_URL = '/api/v1/auth/login'; // REAL, assumed: relative base path

export function useLogin() {
  const setStaff = useAuthStore((s) => s.setStaff);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // MOCK: checks the fake accounts, no network
  async function login({ email, password }) {
    setIsLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 400)); // fake loading time
    const user = MOCK_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    setIsLoading(false);
    if (!user) {
      setError('Invalid email or password');
      return false;
    }
    setMockSession(user.staff);
    setStaff(user.staff);
    return true;
  }

  // REAL: uncomment this and delete the MOCK login above when the backend works
  // async function login({ email, password }) {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const res = await fetch(LOGIN_URL, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     if (!res.ok) {
  //       const data = await res.json().catch(() => ({}));
  //       throw new Error(data.message || 'Login failed');
  //     }
  //     const staff = await fetchCurrentStaff();
  //     if (!staff) throw new Error('Could not load your account');
  //     setStaff(staff);
  //     return true;
  //   } catch (err) {
  //     setError(err.message);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return { login, isLoading, error };
}