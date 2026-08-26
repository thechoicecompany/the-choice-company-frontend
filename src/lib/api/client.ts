import axios from "axios";

export const springApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Attach internal auth token if available (server-side only)
springApi.interceptors.request.use((config) => {
  const token = process.env.INTERNAL_API_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// Normalise error messages
// springApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const msg = error.response?.data?.message || error.message || "API request failed";
//     console.error(`[Spring Boot API] ${msg}`, {
//       url: error.config?.url,
//       status: error.response?.status,
//     });
//     return Promise.reject(new Error(msg));
//   }
// );

springApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "API request failed";
    const status = error.response?.status;

    // 404s are often expected (e.g. fetchProductBySlug probing a slug that
    // doesn't exist) — don't spam the error overlay for them.
    if (status === 404) {
      console.warn(`[Spring Boot API] ${msg}`, { url: error.config?.url, status });
    } else {
      console.error(`[Spring Boot API] ${msg}`, { url: error.config?.url, status });
    }

    return Promise.reject(new Error(msg));
  }
);