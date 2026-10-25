// lib/storage.ts
import { User } from "@/types";

const TOKEN_KEY = "dashboard_token";
const USER_KEY = "dashboard_user";

const isBrowser = () => typeof window !== "undefined";

// যারা session-এর পরিবর্তনের খবর শুনতে চায় (AuthProvider)
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export const storage = {
  getToken(): string | null {
    return isBrowser() ? localStorage.getItem(TOKEN_KEY) : null;
  },

  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notify();
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notify();
  },

  // ---- React-এর useSyncExternalStore-এর জন্য ----

  subscribe(callback: () => void) {
    listeners.add(callback);

    // অন্য ট্যাবে login/logout করলেও এই ট্যাব জানতে পারবে
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === TOKEN_KEY || event.key === USER_KEY) {
        callback();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  },

  // user-এর raw JSON string ফেরত দেয় (string হওয়ায় React সহজে তুলনা করতে পারে)
  getSnapshot(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY) ? localStorage.getItem(USER_KEY) : null;
  },

  parseUser(raw: string | null): User | null {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};