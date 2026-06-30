import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { CartItem } from "../types/store";
import type { ApiResponse } from "./apiTypes";

export async function fetchCartApi(): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.get(API_ROUTES.cart.list);
  return response.data;
}

export async function addToCartApi(productId: string, size: string, qty: number): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.post(API_ROUTES.cart.add, { productId, size, qty });
  return response.data;
}

export async function updateCartQtyApi(productId: string, size: string, qty: number): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.post(API_ROUTES.cart.update, { productId, size, qty });
  return response.data;
}

export async function removeCartLineApi(productId: string, size: string): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.post(API_ROUTES.cart.remove, { productId, size });
  return response.data;
}

export async function clearCartApi(): Promise<ApiResponse<void>> {
  const response = await axiosClient.post(API_ROUTES.cart.clear);
  return response.data;
}
