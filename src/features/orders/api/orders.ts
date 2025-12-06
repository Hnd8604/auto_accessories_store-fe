import { http } from "@/features/auth/api/auth";
import type {
  ApiResponse,
  OrderCreationRequest,
  OrderResponse,
  OrderUpdateByAdminRequest,
  OrderUpdateByUserRequest,
} from "@/types/api";

export const OrdersApi = {
  getAll: () => http.request<ApiResponse<OrderResponse[]>>("/orders"),
  getMyOrders: () => http.request<ApiResponse<OrderResponse[]>>("/orders/my-orders"),
  getById: (orderId: string) => http.request<ApiResponse<OrderResponse>>(`/orders/${orderId}`),
  createFromCart: (payload: OrderCreationRequest) => http.request<ApiResponse<OrderResponse>>("/orders", { method: "POST", body: payload }),
  updateByUser: (orderId: string, payload: OrderUpdateByUserRequest) => http.request<ApiResponse<OrderResponse>>(`/orders/${orderId}/update-by-user`, { method: "PUT", body: payload }),
  updateByAdmin: (orderId: string, payload: OrderUpdateByAdminRequest) => http.request<ApiResponse<OrderResponse>>(`/orders/${orderId}/update-by-admin`, { method: "PUT", body: payload }),
  cancel: (orderId: string) => http.request<ApiResponse<OrderResponse>>(`/orders/${orderId}/cancel`, { method: "PUT" }),
  delete: (orderId: string) => http.request<ApiResponse<void>>(`/orders/${orderId}`, { method: "DELETE" }),
};


