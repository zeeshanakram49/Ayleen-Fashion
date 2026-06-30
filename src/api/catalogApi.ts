import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { Category, Product } from "../types/store";
import type { ApiResponse } from "./apiTypes";

export async function fetchCategoriesApi(): Promise<ApiResponse<Category[]>> {
  const response = await axiosClient.get(API_ROUTES.catalog.categories);
  return response.data;
}

export async function fetchProductsApi(params?: Record<string, unknown>): Promise<ApiResponse<Product[]>> {
  const response = await axiosClient.get(API_ROUTES.catalog.products, { params });
  return response.data;
}

export async function fetchProductBySlugApi(slug: string): Promise<ApiResponse<Product>> {
  const response = await axiosClient.get(API_ROUTES.catalog.productBySlug(slug));
  return response.data;
}

export async function searchProductsApi(query: string): Promise<ApiResponse<Product[]>> {
  const response = await axiosClient.get(API_ROUTES.catalog.search, { params: { q: query } });
  return response.data;
}

export async function fetchFeaturedProductsApi(): Promise<ApiResponse<Product[]>> {
  const response = await axiosClient.get(API_ROUTES.catalog.featured);
  return response.data;
}
