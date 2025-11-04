import { http } from "../auth";
import type { ApiResponse, PermissionResponse } from "../types";

export interface PermissionRequest { name: string; description?: string }

export const PermissionsApi = {
  getAll: () => http.request<ApiResponse<PermissionResponse[]>>("/permissions"),
  create: (payload: PermissionRequest) => http.request<ApiResponse<PermissionResponse>>("/permissions", { method: "POST", body: payload }),
  update: (id: number, payload: PermissionRequest) => http.request<ApiResponse<PermissionResponse>>(`/permissions/${id}`, { method: "PUT", body: payload }),
  delete: (id: number) => http.request<ApiResponse<void>>(`/permissions/${id}`, { method: "DELETE" }),
};


