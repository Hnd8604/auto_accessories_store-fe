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

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  productCount?: number;
}

export interface BrandResponse {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  productCount?: number;
}

export interface ProductImageResponse {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
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

export interface ProductImageRequest {
  productId: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductImageUpdateRequest {
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface BrandRequest {
  name: string;
  description?: string;
}

export interface ProductSearchRequest {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
}
