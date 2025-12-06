import { http } from "@/features/auth/api/auth";
import type {
  ApiResponse,
  ProductImageRequest,
  ProductImageResponse,
  ProductImageUpdateRequest,
} from "@/types/api";

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
  // Create product image - only supports file, productId, isPrimary
  create: (file: File, productId: number, isPrimary: boolean = false) => {
    const formData = new FormData();
    formData.append("file", file);

    // productId and isPrimary are query parameters according to API docs
    const url = new URL(`/api/product-images`, "http://localhost");
    url.searchParams.append("productId", productId.toString());
    url.searchParams.append("isPrimary", isPrimary.toString());

    console.log("API create - URL:", url.pathname + url.search);
    console.log("API create - FormData file:", file.name);

    return http.request<ApiResponse<ProductImageResponse>>(
      url.pathname + url.search,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // Create with full metadata using upload + update approach
  createWithMetadata: async (
    file: File,
    productId: number,
    isPrimary: boolean = false,
    altText?: string,
    sortOrder?: number
  ) => {
    console.log("Creating with metadata:", {
      file: file.name,
      productId,
      isPrimary,
      altText,
      sortOrder,
    });

    // First upload file with basic info
    const createResponse = await ProductImagesApi.create(
      file,
      productId,
      isPrimary
    );

    // Then update with metadata if provided
    if (createResponse.result && (altText || sortOrder !== undefined)) {
      const updateData: ProductImageUpdateRequest = {
        imageUrl: createResponse.result.imageUrl,
        altText: altText || "",
        isPrimary: isPrimary,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
      };

      console.log("Updating with metadata:", updateData);
      return await ProductImagesApi.update(
        createResponse.result.id,
        updateData
      );
    }

    return createResponse;
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
