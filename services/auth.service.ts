// src/services/auth.service.ts
import { api } from "@/lib/api";
import { ApiResponse, AuthResponse, User } from "@/types";
import { LoginValues, SignupValues } from "../validations/auth";

export const authService = {
  async login(input: LoginValues) {
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
    return res.data.data;
  },

  async signup({ name, email, password }: Pick<SignupValues, "name" | "email" | "password">) {
    const res = await api.post<ApiResponse<AuthResponse>>("/auth/signup", {
      name,
      email,
      password,
    });
    return res.data.data;
  },

  async me() {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};