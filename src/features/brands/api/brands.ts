import { http } from "@/features/auth/api/auth";
import type { ApiResponse, BrandRequest, BrandResponse } from "@/types/api";

export const BrandsApi = {
  getAll: () => http.request<ApiResponse<BrandResponse[]>>("/api/brands"),
  getById: (id: string) =>
    http.request<ApiResponse<BrandResponse>>(`/api/brands/${id}`),
  create: (payload: BrandRequest) =>
    http.request<ApiResponse<BrandResponse>>("/api/brands", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: BrandRequest) =>
    http.request<ApiResponse<BrandResponse>>(`/api/brands/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/api/brands/${id}`, {
      method: "DELETE",
    }),
};
