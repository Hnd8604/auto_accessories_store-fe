import { http } from "../auth";
import type { ApiResponse, CategoryRequest, CategoryResponse } from "../types";

export const CategoriesApi = {
  getAll: () =>
    http.request<ApiResponse<CategoryResponse[]>>("/api/categories"),
  getById: (id: number) =>
    http.request<ApiResponse<CategoryResponse>>(`/api/categories/${id}`),
  create: (payload: CategoryRequest) =>
    http.request<ApiResponse<CategoryResponse>>("/api/categories", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: CategoryRequest) =>
    http.request<ApiResponse<CategoryResponse>>(`/api/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/api/categories/${id}`, {
      method: "DELETE",
    }),
};
