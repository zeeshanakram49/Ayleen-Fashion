import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { APP_ROUTES } from "../routes/appRoutes";
import { getToken, removeToken, removeUser } from "../services/tokenService";
import type { ApiError } from "./apiTypes";

const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function normalizeError(error: unknown): ApiError {
  const err = error as AxiosError & { message?: string };
  const response = err?.response as AxiosResponse | undefined;
  const data = response?.data as Record<string, unknown> | string | undefined;

  let message = "Something went wrong. Please try again.";
  let errors: Record<string, string[] | string> | undefined = undefined;

  if (typeof data === "string") {
    message = data;
  } else if (data && typeof data === "object") {
    if (typeof data.payload === "string") {
      message = data.payload;
    } else if (typeof data.message === "string") {
      message = data.message;
    } else if (typeof data.error === "string") {
      message = data.error;
    }

    if (data.errors && typeof data.errors === "object") {
      errors = data.errors as Record<string, string[] | string>;
    }
  } else if (err?.message) {
    message = err.message;
  }

  return {
    message,
    statusCode: response?.status,
    errors,
    raw: error,
  };
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Keep aborted requests as Axios cancellations so consuming screens can
    // silently ignore route changes and React development-mode cleanups.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const response = error.response;
    const data = response?.data as Record<string, unknown> | undefined;
    const unauthorizedByStatus = response?.status === 401;
    const unauthorizedByPayload =
      data?.payload === "User is not authenticated" ||
      data?.message === "401";

    if (unauthorizedByStatus || unauthorizedByPayload) {
      removeToken();
      removeUser();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ayleen:unauthorized"));
        window.location.hash = APP_ROUTES.login;
      }
    }

    const normalized = normalizeError(error);
    return Promise.reject(normalized);
  }
);

export default axiosClient;
