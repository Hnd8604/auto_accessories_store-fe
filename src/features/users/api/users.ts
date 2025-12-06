import { http } from "@/features/auth/api/auth";
import { simpleHttp } from "@/services/httpClient";
import type {
  ApiResponse,
  UserResponse,
  UserCreationRequest,
  UserUpdateRequest,
} from "@/types/api";

export const UsersApi = {
  getAll: () => http.request<ApiResponse<UserResponse[]>>("/api/users"),
  getById: (userId: string) =>
    http.request<ApiResponse<UserResponse>>(`/api/users/${userId}`),
  create: (payload: UserCreationRequest) =>
    http.request<ApiResponse<UserResponse>>("/api/users", {
      method: "POST",
      body: payload,
    }),
  update: (userId: string, payload: UserUpdateRequest) =>
    http.request<ApiResponse<UserResponse>>(`/api/users/${userId}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (userId: string) =>
    http.request<ApiResponse<void>>(`/api/users/${userId}`, {
      method: "DELETE",
    }),
  me: () => http.request<ApiResponse<UserResponse>>("/api/users/my-info"),
};
