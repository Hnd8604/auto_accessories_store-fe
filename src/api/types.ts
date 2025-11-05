// Core API wrapper types
export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}

// Entities (subset based on provided OpenAPI)
export interface RoleResponse {
  id: number;
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
}

export interface PermissionResponse {
  id?: string;
  name?: string;
  description?: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: RoleResponse;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  unitPrice: number;
  categoryName?: string;
  brandName?: string;
  stockQuantity?: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
}

export interface BrandResponse {
  id: number;
  name: string;
  description?: string;
}

export interface ProductImageResponse {
  id: number;
  productId: number;
  imageUrl: string;
  description?: string;
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartResponse {
  totalPrice: number;
  totalItems: number;
  userId: string;
  items?: CartItemResponse[];
}

export interface OrderDetailResponse {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface OrderResponse {
  id: string;
  userId: string;
  totalPrice: number;
  nameRecipient?: string;
  phoneRecipient?: string;
  addressRecipient?: string;
  note?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  orderDetails?: OrderDetailResponse[];
}

// Requests
export interface UserCreationRequest {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface UserUpdateRequest extends Partial<UserCreationRequest> {
  roleId?: string;
}

export interface RoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

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
  description?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface BrandRequest {
  name: string;
  description?: string;
}

export interface CartRequest {
  userId: string;
}

export interface CartItemRequest {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface OrderCreationRequest {
  userId: string;
  nameRecipient?: string;
  phoneRecipient?: string;
  addressRecipient?: string;
  note?: string;
}

export interface OrderUpdateByUserRequest {
  nameRecipient?: string;
  phoneRecipient?: string;
  addressRecipient?: string;
  note?: string;
}

export interface OrderUpdateByAdminRequest {
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
}
