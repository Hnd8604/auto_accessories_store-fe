import { http } from "../auth";
import type { ApiResponse, ProductImageRequest, ProductImageResponse } from "../types";

export const ProductImagesApi = {
  getAll: () => http.request<ApiResponse<ProductImageResponse[]>>("/product-images"),
  getById: (id: number) => http.request<ApiResponse<ProductImageResponse>>(`/product-images/${id}`),
  getByProductId: (productId: number) => http.request<ApiResponse<ProductImageResponse[]>>(`/product-images/products/${productId}`),
  create: (payload: ProductImageRequest) => http.request<ApiResponse<ProductImageResponse>>("/product-images", { method: "POST", body: payload }),
  update: (id: number, payload: ProductImageRequest) => http.request<ApiResponse<ProductImageResponse>>(`/product-images/${id}`, { method: "PUT", body: payload }),
  delete: (id: number) => http.request<ApiResponse<void>>(`/product-images/${id}`, { method: "DELETE" }),
};


