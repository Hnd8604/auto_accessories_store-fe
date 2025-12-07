// Order Detail Response Types
export interface OrderDetailResponse {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
}

// Order Detail Request Types
export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}
