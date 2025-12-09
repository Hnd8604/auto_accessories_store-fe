import { http } from "@/features/auth/api/auth";
import type { ApiResponse, PageResponse, PaginationParams } from "@/types";
import type { PostRequest, PostResponse } from "../types";

export const PostsApi = {
  getAll: (params?: PaginationParams) =>
    http.request<ApiResponse<PageResponse<PostResponse>>>(
      "/posts",
      params ? { params } : undefined
    ),
  getById: (id: number) =>
    http.request<ApiResponse<PostResponse>>(`/posts/id/${id}`),
  getBySlug: (slug: string) =>
    http.request<ApiResponse<PostResponse>>(`/posts/slug/${slug}`),
  getPublished: (params?: PaginationParams) =>
    http.request<ApiResponse<PageResponse<PostResponse>>>(
      "/posts/published",
      params ? { params } : undefined
    ),
  getByCategorySlug: (slug: string, params?: PaginationParams) =>
    http.request<ApiResponse<PageResponse<PostResponse>>>(
      `/posts/category/${slug}`,
      params ? { params } : undefined
    ),
  create: (payload: PostRequest) =>
    http.request<ApiResponse<PostResponse>>("/posts", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: PostRequest) =>
    http.request<ApiResponse<PostResponse>>(`/posts/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/posts/${id}`, {
      method: "DELETE",
    }),
  incrementViewCount: (id: number) =>
    http.request<ApiResponse<void>>(`/posts/${id}/view`, {
      method: "POST",
    }),
};
