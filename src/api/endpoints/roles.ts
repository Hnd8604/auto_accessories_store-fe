import { http } from "../auth";
import type { ApiResponse, RoleRequest, RoleResponse } from "../types";

export const RolesApi = {
  getAll: () => http.request<ApiResponse<RoleResponse[]>>("/roles"),
  getById: (id: number) => http.request<ApiResponse<RoleResponse>>(`/roles/${id}`),
  create: (payload: RoleRequest) => http.request<ApiResponse<RoleResponse>>("/roles", { method: "POST", body: payload }),
  update: (id: number, payload: RoleRequest) => http.request<ApiResponse<RoleResponse>>(`/roles/${id}`, { method: "PUT", body: payload }),
  delete: (id: number) => http.request<ApiResponse<void>>(`/roles/${id}`, { method: "DELETE" }),
};


