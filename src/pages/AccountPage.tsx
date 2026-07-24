import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoCallOutline } from "react-icons/io5";

type AccountMode = "login" | "signup";

const accountImage =
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";

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
        ? "Welcome back! You have successfully signed in to your AYLEEN account."
        : "Welcome to AYLEEN! Your premium membership account has been created."
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
      <div className="overflow-hidden border border-black/5 rounded-[32px] bg-white shadow-xl grid lg:grid-cols-12 min-h-[680px]">
        {/* Left Visual Column */}
        <div className="relative min-h-[350px] lg:col-span-6 lg:min-h-full overflow-hidden">
          <img
            src={accountImage}
            alt="AYLEEN fashion brand portrait"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/70 block mb-2 uppercase">
              AYLEEN MEMBERSHIP
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold leading-tight max-w-md">
              Your curated wardrobe, kept beautifully close.
            </h1>
          </div>
        </div>

        {/* Right Form Column */}
        <article className="flex items-center justify-center px-6 py-12 sm:px-12 lg:col-span-6 lg:px-16 bg-black/[0.005]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
                Member Area
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[var(--ink)] mt-3">
                Account access
              </h2>

              {/* Tab Selector */}
              <div className="flex bg-black/5 p-1 rounded-xl mt-6 relative">
                <button
                  onClick={() => switchMode("login")}
                  className={`flex-1 py-2 text-xs font-bold tracking-wider relative z-10 transition duration-300 ${
                    isLogin ? "text-[var(--ink)]" : "text-[var(--muted)]"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => switchMode("signup")}
                  className={`flex-1 py-2 text-xs font-bold tracking-wider relative z-10 transition duration-300 ${
                    !isLogin ? "text-[var(--ink)]" : "text-[var(--muted)]"
                  }`}
                >
                  CREATE ACCOUNT
                </button>
                <motion.div
                  layoutId="activeAccountTab"
                  className="absolute inset-y-1 left-1 rounded-lg bg-white shadow-sm"
                  style={{
                    width: "calc(50% - 4px)",
                    x: isLogin ? 0 : "100%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={submitAccount}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                          First Name
                        </label>
                        <div className="relative">
                          <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ali"
                            className="h-11 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--ink)]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                          Last Name
                        </label>
                        <div className="relative">
                          <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Khan"
                            className="h-11 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--ink)]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                        Phone Number
                      </label>
                      <div className="relative">
                        <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 03001234567"
                          className="h-11 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--ink)]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--ink)]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--muted)] tracking-wider uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-xs outline-none focus:border-[var(--ink)]"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {isLogin ? (
                <div className="flex justify-end pt-1">
                  <a
                    href="#/account"
                    className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition"
                  >
                    Forgot your password?
                  </a>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-[11px] text-[var(--muted)] leading-relaxed">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-black/10 accent-[var(--ink)]"
                    />
                    <span>
                      I agree to the AYLEEN Terms of Service and confirm that I have read and accepted the Privacy Policy.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-[var(--ink)] text-white text-xs font-bold tracking-[0.2em] transition hover:bg-[var(--gold-deep)] shadow-md mt-4"
              >
                {isLogin ? "SIGN IN" : "CREATE MEMBERSHIP"}
              </button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-black/5 bg-white p-4 text-center text-xs text-[var(--gold-deep)] font-semibold shadow-sm"
              >
                {message}
              </motion.div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
