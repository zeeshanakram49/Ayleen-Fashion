import { APP_ROUTES } from "../routes/appRoutes";
import {
  getHashUrl,
  navigateToHash,
  readHashSearchParams,
} from "../routes/routeUtils";

type OrderFailedPageProps = {
  orderId?: string;
  errorMessage?: string;
};

function readHashErrorMessage() {
  const searchParams = readHashSearchParams();
  return searchParams.get("message") || searchParams.get("error") || "";
}

export function OrderFailedPage({
  orderId,
  errorMessage,
}: OrderFailedPageProps) {
  const displayMessage =
    errorMessage ||
    readHashErrorMessage() ||
    "We were unable to process your payment transaction. Please check your card/wallet details and try again.";

  return (
    <section className="mx-auto max-w-2xl px-5 py-16 sm:px-6 md:py-20 lg:py-24">
      <article className="page-slide-up text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <svg
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-red-600 uppercase">
          Transaction Failed
        </p>
        <h1 className="font-editorial mt-4 text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
          Payment Process Unsuccessful
        </h1>

        {orderId && (
          <p className="mt-2 font-mono text-sm text-[var(--muted)]">
            Reference Order ID:{" "}
            <span className="font-semibold text-[var(--ink)]">{orderId}</span>
          </p>
        )}

        <p className="mx-auto mt-4 max-w-lg rounded-[var(--radius-md)] border border-red-100 bg-red-50/55 p-4 text-sm leading-relaxed text-[var(--muted)] text-red-800">
          {displayMessage}
        </p>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 text-left sm:p-7">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase">
            Need Immediate Assistance?
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            If funds were deducted from your account or you need custom bank
            transfer coordination, please contact support:
          </p>
          <div className="mt-4 grid gap-3 text-xs text-[var(--muted)] sm:grid-cols-2">
            <div>
              <span className="block font-semibold text-[var(--ink)]">
                WhatsApp Helpline:
              </span>
              <a
                href="tel:+924235467243"
                className="transition hover:text-[var(--gold-deep)]"
              >
                +92 42 35467243
              </a>
            </div>
            <div>
              <span className="block font-semibold text-[var(--ink)]">
                Email Support:
              </span>
              <a
                href="mailto:support@aylee.pk"
                className="transition hover:text-[var(--gold-deep)]"
              >
                support@aylee.pk
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigateToHash(APP_ROUTES.checkout)}
            style={{ color: "#ffffff", backgroundColor: "var(--ink)" }}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--ink)] px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-90"
          >
            Retry Payment
          </button>
          <button
            type="button"
            onClick={() => navigateToHash(APP_ROUTES.checkout)}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-transparent px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase transition-colors hover:bg-[var(--panel)]"
          >
            Back to Checkout
          </button>
          <a
            href={getHashUrl(APP_ROUTES.shop)}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-transparent px-8 py-4 text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase transition-colors hover:bg-[var(--panel)]"
          >
            Go to Shop
          </a>
        </div>
      </article>
    </section>
  );
}
