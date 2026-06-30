import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { User, ApiResponse } from "./apiTypes";

export async function registerUser({ name, email, password }: Record<string, string>): Promise<ApiResponse<{ token: string; user: User }>> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  const response = await axiosClient.post(API_ROUTES.auth.register, formData);
  return response.data;
}

export async function loginUser({ email, password }: Record<string, string>): Promise<ApiResponse<{ token: string; user: User }>> {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await axiosClient.post(API_ROUTES.auth.login, formData);
  return response.data;
}

export async function fetchCurrentUser(): Promise<ApiResponse<User>> {
  const response = await axiosClient.get(API_ROUTES.auth.me);
  return response.data;
}
