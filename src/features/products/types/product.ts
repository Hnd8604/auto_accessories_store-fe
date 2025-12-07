// Product Response Types
export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
  categoryName?: string;
  brandName?: string;
  stockQuantity?: number;
  slug?: string;
}

// Product Request Types
export interface ProductRequest {
  name: string;
  description?: string;
  unitPrice: number;
  categoryId: number;
  brandId: number;
  stockQuantity?: number;
}

// Product Search Request
export interface ProductSearchRequest {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
}
