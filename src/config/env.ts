export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL || "http://admin.aylee.store").replace(/\/+$/, ""),
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
  PAYMENT_SUCCESS_URL: import.meta.env.VITE_PAYMENT_SUCCESS_URL || window.location.origin + "/#/order-success",
  PAYMENT_CANCEL_URL: import.meta.env.VITE_PAYMENT_CANCEL_URL || window.location.origin + "/#/order-failed",
};
