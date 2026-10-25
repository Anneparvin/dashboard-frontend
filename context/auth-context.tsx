// context/auth-context.tsx
"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { authService } from "../services/auth.service";
import { User } from "@/types";
import { LoginValues, SignupValues } from "../validations/auth";

type SignupInput = Pick<SignupValues, "name" | "email" | "password">;

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginValues) => Promise<User>;
  signup: (input: SignupInput) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// server-এ আর hydration-এর সময় false, ব্রাউজারে ready হলে true
const subscribeNoop = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  // localStorage-এর session সরাসরি পড়া হচ্ছে, কোনো useEffect বা setState ছাড়া
  const rawUser = useSyncExternalStore(
    storage.subscribe,
    storage.getSnapshot,
    () => null
  );

  const user = useMemo(() => storage.parseUser(rawUser), [rawUser]);

  const login = useCallback(async (input: LoginValues) => {
    const { user: loggedInUser, token } = await authService.login(input);
    storage.setSession(token, loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const { user: newUser, token } = await authService.signup(input);
    storage.setSession(token, newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    storage.clear();
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading: !isHydrated, login, signup, logout }),
    [user, isHydrated, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}