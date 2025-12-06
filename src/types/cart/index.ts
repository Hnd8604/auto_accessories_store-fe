// Cart Response Types
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

export interface CartCreationResponse {
  userId: string;
}

// Cart Request Types
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
