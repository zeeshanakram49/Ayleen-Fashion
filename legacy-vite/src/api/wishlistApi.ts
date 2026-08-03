import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { ApiResponse } from "./apiTypes";

export async function fetchWishlistApi(): Promise<ApiResponse<string[]>> {
  const response = await axiosClient.get(API_ROUTES.wishlist.list);
  // Support both list of IDs directly, or structured data
  return response.data;
}

export async function addFavoriteApi(
  productId: string,
): Promise<ApiResponse<unknown>> {
  const response = await axiosClient.post(API_ROUTES.wishlist.add, {
    productId,
  });
  return response.data;
}

export async function removeFavoriteApi(
  productId: string,
): Promise<ApiResponse<unknown>> {
  const response = await axiosClient.delete(
    API_ROUTES.wishlist.remove(productId),
  );
  return response.data;
}
