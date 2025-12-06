// Order Status Types
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

// Order Response Types
export interface OrderDetailResponse {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
}

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

// Order Request Types
export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreationRequest {
  userId: string;
  nameRecipient?: string;
  phoneRecipient?: string;
  addressRecipient?: string;
  note?: string;
  orderDetails?: OrderDetailRequest[];
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
