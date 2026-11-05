import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { clearMockSession } from './mockAuth'; // MOCK

// const LOGOUT_URL = '/api/v1/auth/logout'; // REAL, assumed: relative base path

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();

  // MOCK: just forgets the fake session
  return async function logout() {
    clearMockSession();
    clear();
    navigate('/login', { replace: true });
  };

  // REAL: uncomment this and delete the MOCK version above when the backend works
  // return async function logout() {
  //   try {
  //     await fetch(LOGOUT_URL, { method: 'POST', credentials: 'include' });
  //   } finally {
  //     clear();
  //     navigate('/login', { replace: true });
  //   }
  // };
}