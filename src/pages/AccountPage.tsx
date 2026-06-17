import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getApiErrorMessage } from "../api/apiError";
import { useAuth } from "../hooks/useAuth";

type AccountMode = "login" | "signup";

const accountImage =
  "/products/product_05_website_square_1600.jpg";

type AccountPageProps = {
  initialMode?: AccountMode;
};

type AuthResult = {
  response: unknown;
  token: string | null;
};

type AuthActions = {
  login: (
    credentials: { email: string; password: string },
    options?: { redirect?: boolean },
  ) => Promise<AuthResult>;
  register: (
    details: { name: string; email: string; password: string },
    options?: { redirect?: boolean },
  ) => Promise<AuthResult>;
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
  const { login, register } = useAuth() as AuthActions;

  const isLogin = mode === "login";

  useEffect(() => {
    setMode(initialMode);
    setMessage("");
    setError("");
  }, [initialMode]);

  function switchMode(nextMode: AccountMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    window.location.hash = nextMode === "login" ? "/login" : "/register";
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
          window.location.hash = "/";
          window.scrollTo({ top: 0, behavior: "smooth" });
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
        window.location.hash = result.token ? "/" : "/login";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 900);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white px-4 py-6 sm:px-5 md:px-8 md:py-12">
      <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white shadow-[var(--shadow-soft)] lg:min-h-[720px] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-[#ede5da] lg:min-h-full">
          <img
            src={accountImage}
            alt="Aylee fashion edit"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-10">
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
                  <a href="#/account" className="font-medium hover:underline">
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
