import axiosClient from "./axiosClient";
import { API_ROUTES } from "./apiRoutes";
import type { PaymentStatusResponse, ApiResponse } from "./apiTypes";

export interface StripeSessionPayload {
  orderId: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    qty: number;
    size: string;
  }>;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentInitiatePayload {
  orderId: string;
  amount: number;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
}

export interface PaymentVerifyPayload {
  orderId: string;
  transactionRef?: string;
  sessionId?: string;
}

export async function createStripeSessionApi(
  payload: StripeSessionPayload,
): Promise<
  ApiResponse<{
    checkoutUrl?: string;
    sessionId?: string;
    clientSecret?: string;
  }>
> {
  const response = await axiosClient.post(
    API_ROUTES.payments.stripeCreateSession,
    payload,
  );
  return response.data;
}

export async function verifyStripePaymentApi(
  payload: PaymentVerifyPayload,
): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  const response = await axiosClient.post(
    API_ROUTES.payments.stripeVerify,
    payload,
  );
  return response.data;
}

export async function initiateJazzCashApi(
  payload: PaymentInitiatePayload,
): Promise<
  ApiResponse<{
    redirectUrl?: string;
    paymentFormFields?: Record<string, string>;
    transactionRef?: string;
    instructions?: string;
  }>
> {
  const response = await axiosClient.post(
    API_ROUTES.payments.jazzcashInitiate,
    payload,
  );
  return response.data;
}

export async function verifyJazzCashApi(
  payload: PaymentVerifyPayload,
): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  const response = await axiosClient.post(
    API_ROUTES.payments.jazzcashVerify,
    payload,
  );
  return response.data;
}

export async function initiateEasyPaisaApi(
  payload: PaymentInitiatePayload,
): Promise<
  ApiResponse<{
    redirectUrl?: string;
    paymentFormFields?: Record<string, string>;
    transactionRef?: string;
    instructions?: string;
  }>
> {
  const response = await axiosClient.post(
    API_ROUTES.payments.easypaisaInitiate,
    payload,
  );
  return response.data;
}

export async function verifyEasyPaisaApi(
  payload: PaymentVerifyPayload,
): Promise<ApiResponse<{ success: boolean; message?: string }>> {
  const response = await axiosClient.post(
    API_ROUTES.payments.easypaisaVerify,
    payload,
  );
  return response.data;
}

export async function pollPaymentStatusApi(
  orderId: string,
): Promise<ApiResponse<PaymentStatusResponse>> {
  const response = await axiosClient.get(
    API_ROUTES.payments.paymentStatus(orderId),
  );
  return response.data;
}
