import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getApiErrorMessage } from "../api/apiError";
import { useAuth } from "../hooks/useAuth";
import { fetchOrdersApi } from "../api/orderApi";
import { money } from "../lib/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl, navigateToHash } from "../routes/routeUtils";
import type { Order } from "../api/apiTypes";

type AccountMode = "login" | "signup";

type AccountPageProps = {
  initialMode?: AccountMode;
};

function getSuccessMessage(response: unknown, fallback: string) {
  if (!response || typeof response !== "object") return fallback;

  const data = response as {
    message?: string;
    data?: { message?: string };
  };

  return data.message ?? data.data?.message ?? fallback;
}

export function AccountPage({ initialMode = "login" }: AccountPageProps) {
  const [mode, setMode] = useState<AccountMode>(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const isLogin = mode === "login";

  useEffect(() => {
    setMode(initialMode);
    setMessage("");
    setError("");
  }, [initialMode]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    async function loadOrders() {
      setOrdersLoading(true);
      try {
        const response = await fetchOrdersApi();
        if (!active) return;
        if (response.success && response.payload) {
          setOrders(response.payload);
        } else if (response.data) {
          setOrders(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setOrdersLoading(false);
      }
    }
    void loadOrders();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  function switchMode(nextMode: AccountMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    navigateToHash(
      nextMode === "login" ? APP_ROUTES.login : APP_ROUTES.register,
    );
  }

  function updateField(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function validateForm() {
    const email = form.email.trim();
    const password = form.password.trim();
    const name = form.name.trim();

    if (!isLogin && !name) return "Please enter your name.";
    if (!email) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password) return "Please enter your password.";

    return "";
  }

  async function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const result = await login(
          {
            email: form.email.trim(),
            password: form.password,
          },
          { redirect: false },
        );

        setMessage(
          getSuccessMessage(
            result.response,
            result.token
              ? "Welcome back. Redirecting you now."
              : "Login successful. Redirecting you now.",
          ),
        );
        window.setTimeout(() => {
          navigateToHash(APP_ROUTES.home);
        }, 650);
        return;
      }

      const result = await register(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        },
        { redirect: false },
      );

      setMessage(
        getSuccessMessage(
          result.response,
          result.token
            ? "Your account has been created. Redirecting you now."
            : "Your account has been created. Please sign in.",
        ),
      );
      window.setTimeout(() => {
        navigateToHash(result.token ? APP_ROUTES.home : APP_ROUTES.login);
      }, 900);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && user) {
    const badgeStyles: Record<string, string> = {
      pending: "bg-amber-50 text-amber-800 border-amber-200",
      paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
      failed: "bg-rose-50 text-rose-800 border-rose-200",
      cancelled: "bg-slate-150 text-slate-600 border-slate-300",
      shipped: "bg-blue-50 text-blue-800 border-blue-200",
      delivered: "bg-teal-50 text-teal-800 border-teal-200",
    };

    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
        <div className="reveal-up is-visible mb-8">
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">
            MEMBER ACCOUNT
          </p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-5xl">
            Dashboard
          </h1>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_2fr]">
          <article className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl font-semibold text-[var(--champagne)] uppercase shadow-sm">
                {user.name ? user.name.charAt(0) : "U"}
              </span>
              <h2 className="font-editorial mt-4 text-2xl text-[var(--ink)]">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>

              <div className="mt-8 w-full border-t border-[var(--line-strong)] pt-6 text-left text-xs leading-6 text-[var(--muted)]">
                <span className="block font-semibold tracking-wider text-[var(--ink)] uppercase">
                  Membership
                </span>
                <p className="mt-1">Aylee Store Member since 2026</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-8 w-full rounded-[var(--radius-sm)] border border-[var(--line-strong)] py-3 text-xs font-semibold tracking-[0.2em] text-red-600 uppercase transition hover:border-red-200 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 sm:p-8">
            <h2 className="font-editorial border-b border-[var(--line)] pb-4 text-2xl text-[var(--ink)]">
              Order History
            </h2>

            {ordersLoading ? (
              <div className="mt-6 space-y-4">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="animate-shimmer h-24 rounded-[var(--radius-md)] bg-[var(--panel)]"
                  ></div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[var(--muted)]">No orders found.</p>
                <a
                  href={getHashUrl(APP_ROUTES.shop)}
                  className="mt-4 inline-flex rounded-[var(--radius-sm)] bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold tracking-wider text-[var(--champagne)]"
                >
                  SHOP NOW
                </a>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-[var(--muted)]">Order ID</span>
                        <p className="font-mono font-bold text-[var(--ink)]">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Placed</span>
                        <p className="font-semibold text-[var(--ink)]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Total</span>
                        <p className="font-bold text-[var(--gold-deep)]">
                          {money(order.total)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Status</span>
                        <span
                          className={`mt-0.5 block rounded-full border px-2 py-0.5 text-center font-semibold capitalize ${
                            badgeStyles[order.status.toLowerCase()] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-6 sm:px-5 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-soft)] lg:min-h-[720px] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-[var(--ink)] lg:min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(145deg,#121212_0%,#2f2b25_58%,#f8f7f4_160%)]" />
          <div className="absolute right-0 bottom-0 left-0 p-7 text-white sm:p-10">
            <p className="text-xs font-semibold tracking-[0.34em] text-white/75">
              AYLEE MEMBERS
            </p>
            <h1 className="font-editorial mt-4 max-w-xl text-4xl leading-tight sm:text-6xl">
              Your wardrobe, kept beautifully close.
            </h1>
          </div>
        </div>

        <article className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="text-center">
              <p className="text-xs font-semibold tracking-[0.32em] text-[var(--gold-deep)]">
                MEMBER ACCESS
              </p>
              <h2 className="mt-5 text-xl font-medium tracking-[0.08em]">
                {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
              </h2>
              <p className="mt-8 text-sm tracking-[0.04em] text-[var(--ink)]">
                {isLogin ? "Not a member yet?" : "Already a member?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(isLogin ? "signup" : "login")}
                  className="font-semibold text-[var(--ink)] underline-offset-4 hover:underline"
                >
                  {isLogin ? "Create Account" : "Sign in"}
                </button>
              </p>
            </div>

            <form className="mt-10 grid gap-7" onSubmit={submitAccount}>
              {!isLogin && (
                <label className="account-field">
                  <span>Name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={updateField}
                    disabled={loading}
                  />
                </label>
              )}

              <label className="account-field">
                <span>Email</span>
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  disabled={loading}
                />
              </label>

              <label className="account-field">
                <span>Password</span>
                <input
                  required
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={updateField}
                  disabled={loading}
                />
              </label>

              {isLogin ? (
                <div className="flex justify-end text-sm">
                  <a
                    href={getHashUrl(APP_ROUTES.account)}
                    className="font-medium hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              ) : (
                <label className="flex items-start gap-3 text-sm leading-7 text-[var(--muted)]">
                  <input
                    required
                    type="checkbox"
                    disabled={loading}
                    className="mt-1 h-4 w-4 rounded-[var(--radius-sm)] border-[var(--line-strong)] accent-[var(--ink)]"
                  />
                  <span>
                    I agree to the Aylee Terms and Conditions and confirm that I
                    have read the Privacy Policy.
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="account-submit mt-6 h-14 w-full text-xs font-semibold tracking-[0.28em]"
              >
                {loading ? "PLEASE WAIT" : isLogin ? "SIGN IN" : "CREATE"}
              </button>
            </form>

            {error && (
              <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="mt-6 border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-center text-sm text-[var(--muted)]">
                {message}
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
