import type { OrderStatus, PaymentStatus } from './order-status';
import type { OrderDetailResponse, OrderDetailRequest } from './order-detail';

// Order Response Types
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

export interface OrderUpdateStatusRequest {
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
}
