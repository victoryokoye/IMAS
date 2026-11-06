import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { getMockSession } from './mockAuth'; // MOCK

// const ME_URL = '/api/v1/auth/me'; // REAL, assumed: relative base path

// MOCK: reads the fake session so a page refresh keeps you logged in
export async function fetchCurrentStaff() {
  return getMockSession();
}

// REAL: uncomment this and delete the MOCK version above when the backend works
// export async function fetchCurrentStaff() {
//   try {
//     const res = await fetch(ME_URL, { credentials: 'include' });
//     if (!res.ok) return null;
//     const json = await res.json();
//     return json.data;
//   } catch {
//     return null;
//   }
// }

export function useCurrentStaff() {
  const setStaff = useAuthStore((s) => s.setStaff);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    fetchCurrentStaff().then((staff) => (staff ? setStaff(staff) : clear()));
  }, [setStaff, clear]);
}