import { useState } from 'react';
import { mockDelay, signInIntern, signOutIntern } from './mockAttendance'; // MOCK

// const ENDPOINTS = {
//   'sign-in': '/api/v1/attendance/sign-in', // REAL, assumed: relative base path
//   'sign-out': '/api/v1/attendance/sign-out', // REAL, assumed: relative base path
// };

export function useAttendanceAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // MOCK: any PIN other than 1234 fails, so you can test the error state
  async function submit({ internId, action, pin }) {
    setIsLoading(true);
    setError(null);
    try {
      await mockDelay();
      if (action === 'sign-in') signInIntern(internId, pin);
      else if (action === 'sign-out') signOutIntern(internId, pin);
      else throw new Error('This action is not available yet'); // assumed: absent has no mock
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // REAL: uncomment this and delete the MOCK version above when the backend works
  // async function submit({ internId, action, pin }) {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const res = await fetch(ENDPOINTS[action], {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ internId, pin }),
  //     });
  //     if (!res.ok) {
  //       const body = await res.json().catch(() => ({}));
  //       throw new Error(body.message || 'Something went wrong');
  //     }
  //     return true;
  //   } catch (err) {
  //     setError(err.message);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return { submit, isLoading, error };
}