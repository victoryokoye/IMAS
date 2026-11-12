const KEY = "imas_token";

/**
 * sessionStorage: survives refresh, cleared when the tab/browser closes (safer on shared
 * attendance computers). Use `localStorage` instead if staff should stay signed in across
 * tabs and restarts. Everything is wrapped in try/catch because storage can be blocked.
 */
const storage = (): Storage | null => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const tokenStorage = {
  get(): string | null {
    try {
      return storage()?.getItem(KEY) ?? null;
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      storage()?.setItem(KEY, token);
    } catch {
      /* storage unavailable: the token just won't survive a refresh */
    }
  },
  clear() {
    try {
      storage()?.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};
