import { useEffect, useState } from "react";
import {
  pollPaymentStatusApi,
  verifyEasyPaisaApi,
  verifyJazzCashApi,
  verifyStripePaymentApi,
} from "../api/paymentApi";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash, readHashSearchParams } from "../routes/routeUtils";

type PaymentProcessingPageProps = {
  orderId?: string;
};

export function PaymentProcessingPage({ orderId }: PaymentProcessingPageProps) {
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState(
    "Securing transaction channel. We are verifying your payment status with your bank..."
  );

  useEffect(() => {
    if (!orderId) {
      navigateToHash(APP_ROUTES.home);
      return;
    }

    let active = true;
    let timeoutId: number;
    const currentOrderId = orderId;
    const maxAttempts = 30; // Max 60 seconds (30 * 2s)

    async function verify() {
      if (!active) return;
      try {
        const searchParams = readHashSearchParams();
        const provider = searchParams.get("provider")?.toLowerCase();
        const transactionRef =
          searchParams.get("transactionRef") ||
          searchParams.get("transaction_ref") ||
          undefined;
        const sessionId = searchParams.get("session_id") || undefined;

        if (attempts === 0 && provider) {
          const payload = {
            orderId: currentOrderId,
            transactionRef,
            sessionId,
          };
          const verifyResponse =
            provider === "jazzcash"
              ? await verifyJazzCashApi(payload)
              : provider === "easypaisa"
                ? await verifyEasyPaisaApi(payload)
                : provider === "stripe"
                  ? await verifyStripePaymentApi(payload)
                  : null;

          if (!active) return;
          if (verifyResponse?.success) {
            navigateToHash(`${APP_ROUTES.orderSuccess}/${currentOrderId}`);
            return;
          }
        }

        const response = await pollPaymentStatusApi(currentOrderId);
        if (!active) return;

        if (response.success && response.payload) {
          const { paymentStatus } = response.payload;
          if (paymentStatus === "paid") {
            navigateToHash(`${APP_ROUTES.orderSuccess}/${currentOrderId}`);
            return;
          } else if (paymentStatus === "failed") {
            navigateToHash(`${APP_ROUTES.orderFailed}/${currentOrderId}?message=Payment+transaction+failed.`);
            return;
          } else if (paymentStatus === "cancelled") {
            navigateToHash(`${APP_ROUTES.orderFailed}/${currentOrderId}?message=Payment+cancelled+by+customer.`);
            return;
          }
        }

        if (attempts >= maxAttempts) {
          navigateToHash(
            `${APP_ROUTES.orderFailed}/${currentOrderId}?message=Transaction+verification+timeout.+Please+verify+your+account+or+contact+support.`
          );
          return;
        }

        setMessage(`Verifying transaction reference... Attempt ${attempts + 1} of ${maxAttempts}`);
        setAttempts((prev) => prev + 1);
        timeoutId = window.setTimeout(verify, 2000);
      } catch {
        if (!active) return;
        // Silently retry on temporary network failure
        if (attempts >= maxAttempts) {
          navigateToHash(
            `${APP_ROUTES.orderFailed}/${currentOrderId}?message=Temporary+network+error+verifying+payment.+Please+check+your+connection.`
          );
          return;
        }
        setAttempts((prev) => prev + 1);
        timeoutId = window.setTimeout(verify, 2000);
      }
    }

    timeoutId = window.setTimeout(verify, 2000);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [orderId, attempts]);

  return (
    <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6 md:py-28">
      <div className="reveal-up is-visible flex flex-col items-center">
        {/* Animated premium concentric spinner */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-[var(--line)] border-t-[var(--gold-deep)] animate-spin"></div>
          <div className="absolute h-16 w-16 rounded-full border-4 border-[var(--line)] border-b-[var(--ink)] animate-spin-reverse"></div>
          <svg
            className="h-6 w-6 text-[var(--gold-deep)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
          Payment Processing
        </p>
        <h1 className="font-editorial mt-4 text-3xl sm:text-4xl text-[var(--ink)]">
          Verifying secure transaction
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          {message}
        </p>

        <div className="mt-12 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel)] p-5 text-xs text-[var(--muted)]">
          <p className="font-semibold text-[var(--ink)]">IMPORTANT NOTES:</p>
          <ul className="mt-2 space-y-1 text-left list-disc list-inside">
            <li>Do not close this window or refresh your browser tab.</li>
            <li>Ensure you authorize any authentication requests sent by your bank app/SMS.</li>
            <li>Verification completes automatically once status confirmation is received.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
