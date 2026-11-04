import { useState } from 'react';

const ENDPOINTS = {
  'sign-in': '/api/v1/attendance/sign-in', // assumed: relative base path
  'sign-out': '/api/v1/attendance/sign-out', // assumed: relative base path
};

export function useAttendanceAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit({ internId, action, pin }) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINTS[action], {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internId, pin }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Something went wrong');
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}