import { http } from "@/features/auth/api/auth";
import type { ApiResponse, CategoryRequest, CategoryResponse } from "@/types";

export const CategoriesApi = {
  getAll: () =>
    http.request<ApiResponse<CategoryResponse[]>>("/categories"),
  getById: (id: number) =>
    http.request<ApiResponse<CategoryResponse>>(`/categories/id/${id}`),
  getBySlug: (slug: string) =>
    http.request<ApiResponse<CategoryResponse>>(`/categories/slug/${slug}`),
  create: (payload: CategoryRequest) =>
    http.request<ApiResponse<CategoryResponse>>("/categories", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: CategoryRequest) =>
    http.request<ApiResponse<CategoryResponse>>(`/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/categories/${id}`, {
      method: "DELETE",
    }),
};
