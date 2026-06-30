export type PaymentFlowState =
  | "idle"
  | "creating_order"
  | "redirecting"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled";

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
}
