import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';

const ME_URL = '/api/v1/auth/me'; // assumed: relative path, needs a proxy if the backend is on another origin

export async function fetchCurrentStaff() {
  try {
    const res = await fetch(ME_URL, { credentials: 'include' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export function useCurrentStaff() {
  const setStaff = useAuthStore((s) => s.setStaff);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    fetchCurrentStaff().then((staff) => (staff ? setStaff(staff) : clear()));
  }, [setStaff, clear]);
}