import { useState } from "react";

type AccountMode = "login" | "signup";

const accountImage =
  "/products/product_05_website_square_1600.jpg";

export function AccountPage() {
  const [mode, setMode] = useState<AccountMode>("login");
  const [message, setMessage] = useState("");

  const isLogin = mode === "login";

  function switchMode(nextMode: AccountMode) {
    setMode(nextMode);
    setMessage("");
  }

  function submitAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      isLogin
        ? "Welcome back. Your Aylee account is ready."
        : "Your Aylee account has been created.",
    );
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
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="account-field">
                    <span>First name</span>
                    <input required name="firstName" autoComplete="given-name" />
                  </label>
                  <label className="account-field">
                    <span>Last name</span>
                    <input required name="lastName" autoComplete="family-name" />
                  </label>
                </div>
              )}

              {!isLogin && (
                <label className="account-field">
                  <span>Phone</span>
                  <input required name="phone" type="tel" autoComplete="tel" />
                </label>
              )}

              <label className="account-field">
                <span>Email</span>
                <input required name="email" type="email" autoComplete="email" />
              </label>

              <label className="account-field">
                <span>Password</span>
                <input
                  required
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
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
                className="account-submit mt-6 h-14 w-full text-xs font-semibold tracking-[0.28em]"
              >
                {isLogin ? "SIGN IN" : "CREATE"}
              </button>
            </form>

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
