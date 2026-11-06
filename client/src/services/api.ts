import axios from "axios";

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "https://imas-iobx.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // JWT lives in an HTTP-only cookie
  timeout: 30_000, // Render free instances can take a while to wake up
  headers: { "Content-Type": "application/json" },
});

/**
 * Requests whose 401 does NOT mean "session expired".
 * - /auth/*: handled by the login screen
 * - sign-in / sign-out / verify-pin: a wrong intern PIN can come back as 401,
 *   which must show "Invalid PIN" in the dialog, not log the coordinator out.
 */
const NO_REDIRECT_ON_401 = ["/auth/", "/attendance/sign-", "/attendance/check-", "/verify-pin"];

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";
      const skip = NO_REDIRECT_ON_401.some((p) => url.includes(p));
      if (!skip && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);
