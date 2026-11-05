import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const LOGOUT_URL = '/api/v1/auth/logout'; // assumed: same base path note as ME_URL

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();

  return async function logout() {
    try {
      await fetch(LOGOUT_URL, { method: 'POST', credentials: 'include' });
    } finally {
      clear();
      navigate('/login', { replace: true });
    }
  };
}