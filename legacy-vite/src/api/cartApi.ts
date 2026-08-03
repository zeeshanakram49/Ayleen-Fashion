import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { CartItem } from "../types/store";
import type { ApiResponse } from "./apiTypes";
import { getOrCreateGuestToken } from "../services/guestTokenService";

export async function fetchCartApi(): Promise<ApiResponse<CartItem[]>> {
  try {
    const response = await axiosClient.get(API_ROUTES.cart.list);
    return response.data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function addToCartApi(
  productId: string,
  qty: number,
): Promise<ApiResponse<CartItem[]>> {
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("quantity", String(qty));

  const response = await axiosClient.post(API_ROUTES.cart.add, formData, {
    headers: {
      "X-Guest-Token": getOrCreateGuestToken(),
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function updateCartQtyApi(
  productId: string,
  size: string,
  qty: number,
): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.post(API_ROUTES.cart.update, {
    productId,
    size,
    qty,
  });
  return response.data;
}

export async function removeCartLineApi(
  productId: string,
  size: string,
): Promise<ApiResponse<CartItem[]>> {
  const response = await axiosClient.post(API_ROUTES.cart.remove, {
    productId,
    size,
  });
  return response.data;
}

export async function clearCartApi(): Promise<ApiResponse<void>> {
  const response = await axiosClient.post(API_ROUTES.cart.clear);
  return response.data;
}
