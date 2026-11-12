import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "https://imas-wnxj.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // harmless if the server also sets a cookie
  timeout: 30_000, // Render free instances can take a while to wake up
  headers: { "Content-Type": "application/json" },
});

// Attach the stored JWT to every request
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Requests whose 401 does NOT mean "session expired".
 * - /auth/*: handled by the login screen / bootstrap
 * - sign-in / sign-out / verify-pin: a wrong intern PIN can come back as 401
 */
const NO_REDIRECT_ON_401 = ["/auth/", "/attendance/sign-", "/attendance/check-", "/verify-pin"];

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";
      const skip = NO_REDIRECT_ON_401.some((p) => url.includes(p));
      if (!skip) {
        tokenStorage.clear(); // expired or invalid token
        if (window.location.pathname !== "/login") window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);
