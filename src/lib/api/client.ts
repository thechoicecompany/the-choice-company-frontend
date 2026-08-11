import axios from "axios";

export const springApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
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
springApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "API request failed";
    console.error(`[Spring Boot API] ${msg}`, {
      url: error.config?.url,
      status: error.response?.status,
    });
    return Promise.reject(new Error(msg));
  }
);
