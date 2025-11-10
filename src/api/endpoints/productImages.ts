import { http } from "../auth";
import type {
  ApiResponse,
  ProductImageRequest,
  ProductImageResponse,
  ProductImageUpdateRequest,
} from "../types";

export const ProductImagesApi = {
  getAll: () =>
    http.request<ApiResponse<ProductImageResponse[]>>("/api/product-images"),
  getById: (id: number) =>
    http.request<ApiResponse<ProductImageResponse>>(
      `/api/product-images/${id}`
    ),
  getByProductId: (productId: number) =>
    http.request<ApiResponse<ProductImageResponse[]>>(
      `/api/product-images/products/${productId}`
    ),
  create: (file: File, productId: number, isPrimary: boolean = false) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId.toString());
    formData.append("isPrimary", isPrimary.toString());

    return http.request<ApiResponse<ProductImageResponse>>(
      `/api/product-images`,
      {
        method: "POST",
        body: formData,
      }
    );
  },
  update: (id: number, payload: ProductImageUpdateRequest) =>
    http.request<ApiResponse<ProductImageResponse>>(
      `/api/product-images/${id}`,
      {
        method: "PUT",
        body: payload,
      }
    ),
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
