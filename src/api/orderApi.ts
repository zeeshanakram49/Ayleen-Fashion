import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { Order, PaymentMethod } from "./apiTypes";
import type { CartItem } from "../types/store";
import type { ApiResponse } from "./apiTypes";

export interface CreateOrderPayload {
  customerDetails: {
    fullName: string;
    email?: string;
    phone: string;
  };
  shippingDetails: {
    address: string;
    city: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export async function createOrderApi(payload: CreateOrderPayload): Promise<ApiResponse<{ orderId: string; total: number }>> {
  const response = await axiosClient.post(API_ROUTES.orders.create, payload);
  return response.data;
}

export async function fetchOrdersApi(): Promise<ApiResponse<Order[]>> {
  const response = await axiosClient.get(API_ROUTES.orders.list);
  return response.data;
}

export async function fetchOrderDetailApi(orderId: string): Promise<ApiResponse<Order>> {
  const response = await axiosClient.get(API_ROUTES.orders.detail(orderId));
  return response.data;
}

export async function cancelOrderApi(orderId: string): Promise<ApiResponse<void>> {
  const response = await axiosClient.post(API_ROUTES.orders.cancel(orderId));
  return response.data;
}
