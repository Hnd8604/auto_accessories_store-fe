import type { CartItemResponse } from './cart-item';

// Cart Response Types
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
