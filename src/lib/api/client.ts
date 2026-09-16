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
  timeout: 60_000,
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

    return Promise.reject(new ApiError(msg, status, retryAfter));
  }
);

// ─── Admin client ───────────────────────────────────────────────────────────
// Routes through /api/proxy instead of hitting Spring Boot directly.
// The JWT lives only in the httpOnly `tcc_admin_token` cookie — the browser
// sends it automatically on same-origin requests, and the proxy route reads
// it server-side to attach the Authorization header Spring Boot expects.
// There is no token in localStorage anymore, so we no longer try to read
// one here.
export const adminApi = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "API request failed";
    const status = error.response?.status;
    const retryAfter = error.response?.headers?.["retry-after"] ?? null;

    if (status === 401 && typeof window !== "undefined") {
      // The httpOnly cookie can't be cleared from JS — middleware clears it
      // server-side on the next request once it sees an invalid/expired token.
      window.location.href = "/admin/login?reason=session_expired";
    }

    console.error(`[Admin API] ${msg}`, { url: error.config?.url, status });
    return Promise.reject(new ApiError(msg, status, retryAfter));
  }
);