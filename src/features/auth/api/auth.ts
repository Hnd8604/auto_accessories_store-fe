import AuthHttpClient from "@/services/http";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/config";
import { UsersApi } from "@/features/users/api/users";
import type { UserCreationRequest, UserResponse } from "@/types/api";

export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  authenticated: boolean;
}

export const refreshCall = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string } | null> => {
  try {
    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken } satisfies RefreshRequest),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as
      | { code?: number; result?: RefreshResponse }
      | RefreshResponse;
    const payload = ("result" in data ? data.result : data) as RefreshResponse;
    if (!payload?.accessToken) return null;
    return { accessToken: payload.accessToken };
  } catch {
    return null;
  }
};

export const http = new AuthHttpClient(refreshCall);

export const AuthService = {
  async login(payload: AuthenticationRequest) {
    const data = await http.request<
      { result?: AuthenticationResponse } | AuthenticationResponse
    >("/api/auth/token", { method: "POST", body: payload });
    const response: AuthenticationResponse =
      (data as any).result ?? (data as AuthenticationResponse);
    if (typeof window !== "undefined" && response.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken || "");
    }
    return response;
  },

  async register(payload: UserCreationRequest) {
    // Use public API for user registration
    return UsersApi.create(payload);
  },

  async logout() {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem(ACCESS_TOKEN_KEY)
          : null;
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem(REFRESH_TOKEN_KEY)
          : null;
      await http.request("/api/auth/logout", {
        method: "POST",
        body: { accessToken, refreshToken },
      });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  },
};
