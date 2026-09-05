import axios from "axios";

// ── NEW: preserves status + retry-after through the interceptor boundary ──
export class ApiError extends Error {
  status?: number;
  retryAfter?: string | null;
  constructor(message: string, status?: number, retryAfter?: string | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export const springApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

springApi.interceptors.request.use((config) => {
  const token = process.env.INTERNAL_API_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

springApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "API request failed";
    const status = error.response?.status;
    const retryAfter = error.response?.headers?.["retry-after"] ?? null;

    if (status === 404) {
      console.warn(`[Spring Boot API] ${msg}`, { url: error.config?.url, status });
    } else {
      console.error(`[Spring Boot API] ${msg}`, { url: error.config?.url, status });
    }

    // FIX: carry status + retryAfter forward instead of a bare Error
    return Promise.reject(new ApiError(msg, status, retryAfter));
  }
);

// ─── Admin client (unchanged, but see note below) ───────
export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

adminApi.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("tcc_admin_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "API request failed";
    const status = error.response?.status;
    const retryAfter = error.response?.headers?.["retry-after"] ?? null;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("tcc_admin_token");
      localStorage.removeItem("tcc_admin_user");
      document.cookie = "tcc_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      window.location.href = "/admin/login";
    }

    console.error(`[Admin API] ${msg}`, { url: error.config?.url, status });
    return Promise.reject(new ApiError(msg, status, retryAfter));
  }
);