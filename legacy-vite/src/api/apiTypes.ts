export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
}

export type PaymentMethod = "COD" | "JAZZCASH" | "EASYPAISA" | "CARD";

export type OrderStatus =
  "pending" | "paid" | "failed" | "cancelled" | "shipped" | "delivered";

export interface OrderItem {
  productId: string;
  productTitle: string;
  qty: number;
  price: number;
  size: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  note?: string;
  createdAt: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  payload?: T;
  data?: T;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[] | string>;
  raw?: unknown;
}
