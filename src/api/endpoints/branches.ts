import { http } from "../auth";
import type { ApiResponse, BranchRequest, BranchResponse } from "../types";

export const BranchesApi = {
  getAll: () => http.request<ApiResponse<BranchResponse[]>>("/api/branches"),
  getById: (id: string) =>
    http.request<ApiResponse<BranchResponse>>(`/api/branches/${id}`),
  create: (payload: BranchRequest) =>
    http.request<ApiResponse<BranchResponse>>("/api/branches", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: BranchRequest) =>
    http.request<ApiResponse<BranchResponse>>(`/api/branches/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/api/branches/${id}`, {
      method: "DELETE",
    }),
};
