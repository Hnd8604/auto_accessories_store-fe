import { http } from "../auth";
import type {
  ApiResponse,
  ProductImageRequest,
  ProductImageResponse,
  ProductImageUpdateRequest,
} from "../types";

export const ProductImagesApi = {
  getAll: () =>
    http.request<ApiResponse<ProductImageResponse[]>>("/product-images"),
  getById: (id: number) =>
    http.request<ApiResponse<ProductImageResponse>>(`/product-images/${id}`),
  getByProductId: (productId: number) =>
    http.request<ApiResponse<ProductImageResponse[]>>(
      `/api/product-images/products/${productId}`
    ),
  create: (payload: ProductImageRequest) =>
    http.request<ApiResponse<ProductImageResponse>>("/api/product-images", {
      method: "POST",
      body: payload,
    }),
  update: (id: number, payload: ProductImageUpdateRequest) =>
    http.request<ApiResponse<ProductImageResponse>>(`/api/product-images/${id}`, {
      method: "PUT",
      body: payload,
    }),
  delete: (id: number) =>
    http.request<ApiResponse<void>>(`/api/product-images/${id}`, {
      method: "DELETE",
    }),
  setPrimary: (productId: number, imageId: number) =>
    http.request<ApiResponse<void>>(
      `/api/product-images/products/${productId}/images/${imageId}/set-primary`,
      { method: "POST" }
    ),
};
