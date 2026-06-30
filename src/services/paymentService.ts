import { loadStripe } from "@stripe/stripe-js";
import { ENV } from "../config/env";
import {
  createStripeSessionApi,
  initiateJazzCashApi,
  initiateEasyPaisaApi,
} from "../api/paymentApi";
import type { PaymentDetails } from "../types/payment";

export function submitHiddenForm(actionUrl: string, fields: Record<string, string>): void {
  if (typeof document === "undefined") return;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;

  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export async function processStripePayment(
  details: PaymentDetails,
  items: Array<{
    productId: string;
    title: string;
    price: number;
    qty: number;
    size: string;
  }>
): Promise<{ success: boolean; redirectUrl?: string; message?: string }> {
  try {
    const response = await createStripeSessionApi({
      orderId: details.orderId,
      amount: details.amount,
      currency: details.currency,
      customer: {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
      },
      items,
      successUrl: ENV.PAYMENT_SUCCESS_URL + "?orderId=" + details.orderId + "&session_id={CHECKOUT_SESSION_ID}",
      cancelUrl: ENV.PAYMENT_CANCEL_URL + "?orderId=" + details.orderId,
    });

    if (!response.success || !response.payload) {
      throw new Error(response.message || "Failed to create Stripe Checkout session");
    }

    const { checkoutUrl, sessionId } = response.payload;

    if (checkoutUrl) {
      return { success: true, redirectUrl: checkoutUrl };
    }

    if (sessionId && ENV.STRIPE_PUBLISHABLE_KEY) {
      await loadStripe(ENV.STRIPE_PUBLISHABLE_KEY);
    }

    throw new Error("No checkout URL or Stripe session key returned by the backend.");
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "Stripe initialization failed" };
  }
}

export async function processJazzCashPayment(
  details: PaymentDetails
): Promise<{ success: boolean; redirectUrl?: string; message?: string; instructions?: string }> {
  try {
    const response = await initiateJazzCashApi({
      orderId: details.orderId,
      amount: details.amount,
      customer: {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
      },
    });

    if (!response.success || !response.payload) {
      throw new Error(response.message || "Failed to initiate JazzCash transaction");
    }

    const { redirectUrl, paymentFormFields, instructions } = response.payload;

    if (redirectUrl) {
      if (paymentFormFields && Object.keys(paymentFormFields).length > 0) {
        submitHiddenForm(redirectUrl, paymentFormFields);
        return { success: true };
      }
      return { success: true, redirectUrl };
    }

    if (instructions) {
      return { success: true, instructions };
    }

    throw new Error("JazzCash response did not contain redirect endpoints or instructions.");
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "JazzCash payment failed" };
  }
}

export async function processEasyPaisaPayment(
  details: PaymentDetails
): Promise<{ success: boolean; redirectUrl?: string; message?: string; instructions?: string }> {
  try {
    const response = await initiateEasyPaisaApi({
      orderId: details.orderId,
      amount: details.amount,
      customer: {
        name: details.customerName,
        email: details.customerEmail,
        phone: details.customerPhone,
      },
    });

    if (!response.success || !response.payload) {
      throw new Error(response.message || "Failed to initiate EasyPaisa transaction");
    }

    const { redirectUrl, paymentFormFields, instructions } = response.payload;

    if (redirectUrl) {
      if (paymentFormFields && Object.keys(paymentFormFields).length > 0) {
        submitHiddenForm(redirectUrl, paymentFormFields);
        return { success: true };
      }
      return { success: true, redirectUrl };
    }

    if (instructions) {
      return { success: true, instructions };
    }

    throw new Error("EasyPaisa response did not contain redirect endpoints or instructions.");
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message || "EasyPaisa payment failed" };
  }
}
