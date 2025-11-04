import { http } from "../auth";
import type { ApiResponse, ProductRequest, ProductResponse } from "../types";

export interface PageProductResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ProductResponse[];
  number: number;
}

export const ProductsApi = {
  getAll: (params?: { page?: number; size?: number; sort?: string }) =>
    http.request<ApiResponse<PageProductResponse>>(
      `/api/products${buildQuery(params)}`
    ),
  getById: (id: number) =>
    http.request<ApiResponse<ProductResponse>>(`/api/products/${id}`),
  create: (payload: ProductRequest) =>
    http.request<ApiResponse<ProductResponse>>("/api/products", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: ProductRequest) =>
    http.request<ApiResponse<ProductResponse>>(`/api/products/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/api/products/${id}`, {
      method: "DELETE",
    }),
  byCategory: (categoryId: number) =>
    http.request<ApiResponse<ProductResponse[]>>(
      `/api/products/categories/${categoryId}`
    ),
  byBranch: (branchId: number) =>
    http.request<ApiResponse<ProductResponse[]>>(
      `/api/products/branches/${branchId}`
    ),
};

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    usp.append(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}
