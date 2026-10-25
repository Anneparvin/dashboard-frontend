// src/lib/api.ts
import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/login") ||
      error.config?.url?.startsWith("/auth/signup");

    // login/signup-এর ভুল password-এর 401 বাদে, অন্য যেকোনো 401 মানে session শেষ
    if (axios.isAxiosError(error) && error.response?.status === 401 && !isAuthRequest) {
      storage.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Backend-এর error message সুন্দরভাবে বের করার helper
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0].message; // validation error হলে প্রথমটা দেখাবে
    }
    if (data?.message) return data.message;
    if (!error.response) return "Cannot reach the server. Is the backend running?";
  }
  return "Something went wrong. Please try again.";
}