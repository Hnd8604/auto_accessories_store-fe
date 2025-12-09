import AuthHttpClient, { simpleHttp } from "@/services/axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, API_BASE_URL } from "@/constants/config";
import { UsersApi } from "@/features/users/api/users";
import type {
  UserCreationRequest,
  UserResponse,
  AuthenticationRequest,
  AuthenticationResponse,
  RefreshRequest,
  RefreshResponse,
} from "@/features/users/types";

export const refreshCall = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string } | null> => {
  try {
    const res = await fetch(`http://localhost:8080/api/v1/auth/refresh`, {
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
    // Step 1: Authenticate and get tokens
    // Use simpleHttp to send session cookie for cart sync
    const data = await simpleHttp.request<
      { result?: AuthenticationResponse } | AuthenticationResponse
    >("/auth/token", { method: "POST", body: payload });
    const response: AuthenticationResponse =
      (data as any).result ?? (data as AuthenticationResponse);
    
    // Step 2: Save tokens to localStorage
    if (typeof window !== "undefined" && response.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken || "");
    }

    // Step 3: Fetch complete user info with roles from /users/my-info
    try {
      console.log("Fetching user info with roles from /users/my-info...");
      
      const myInfoRes = await fetch(`${API_BASE_URL}/users/my-info`, {
        headers: {
          "Authorization": `Bearer ${response.accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!myInfoRes.ok) {
        console.error(`Failed to fetch user info: ${myInfoRes.status}`);
        return response;
      }

      const myInfoData = await myInfoRes.json();
      const userWithRoles = (myInfoData as any).result ?? (myInfoData as UserResponse);
      console.log("User with roles from my-info:", userWithRoles);
      console.log("Roles:", userWithRoles?.roles);
      
      // Return response with complete user data including roles
      return {
        ...response,
        user: userWithRoles
      };
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
      return response;
    }
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
      await http.request("/auth/logout", {
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
