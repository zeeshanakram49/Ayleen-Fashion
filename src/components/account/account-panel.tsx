"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/lib/validation/schemas";
import { Spinner } from "@/components/motion/spinner";
import type { z } from "zod";

type AccountInput = z.infer<typeof accountSchema>;
type User = {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
};

export function AccountPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [serverMessage, setServerMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: { mode: "login", name: "", email: "", password: "" },
  });

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((body: { authenticated?: boolean; user?: User }) =>
        setUser(body.authenticated ? body.user || null : null),
      )
      .catch(() => setUser(null))
      .finally(() => setLoadingSession(false));
  }, []);

  async function submit(values: AccountInput) {
    setServerMessage("");
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, mode }),
    });
    const body = (await response.json()) as {
      authenticated?: boolean;
      user?: User;
      message?: string;
    };
    if (!response.ok) {
      setServerMessage(body.message || "Unable to continue.");
      return;
    }
    setUser(body.user || null);
    reset({ mode, name: "", email: "", password: "" });
  }

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
    setLoggingOut(false);
  }

  if (loadingSession)
    return <div className="skeleton h-80" aria-label="Loading account" />;

  if (user) {
    return (
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <aside className="border border-[#dedbd2] bg-[#f7f5f0] p-7">
          <p className="eyebrow">Signed in</p>
          <h2 className="serif mt-3 text-3xl">
            {user.name || "Aylee customer"}
          </h2>
          <p className="mt-2 text-sm text-[#6c6961]">{user.email}</p>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase underline underline-offset-4 disabled:opacity-60"
          >
            {loggingOut ? <Spinner size={13} /> : null}
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </aside>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="border border-[#dedbd2] p-7 transition hover:bg-[#f7f5f0]"
          >
            <h3 className="serif text-3xl">Orders</h3>
            <p className="mt-2 text-sm text-[#6c6961]">
              View order history from the commerce backend.
            </p>
          </Link>
          <Link
            href="/account/addresses"
            className="border border-[#dedbd2] p-7 transition hover:bg-[#f7f5f0]"
          >
            <h3 className="serif text-3xl">Addresses</h3>
            <p className="mt-2 text-sm text-[#6c6961]">
              Review the address currently linked to your account.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg border border-[#dedbd2] p-6 md:p-9">
      <div className="grid grid-cols-2 border-b border-[#dedbd2]">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`pb-4 text-sm font-semibold ${mode === "login" ? "border-b-2 border-[#171613]" : "text-[#6c6961]"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`pb-4 text-sm font-semibold ${mode === "register" ? "border-b-2 border-[#171613]" : "text-[#6c6961]"}`}
        >
          Create account
        </button>
      </div>
      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-5">
        {mode === "register" ? (
          <label className="block text-sm">
            Name
            <input
              {...register("name")}
              className="field mt-2"
              autoComplete="name"
            />
          </label>
        ) : null}
        <label className="block text-sm">
          Email
          <input
            {...register("email")}
            type="email"
            className="field mt-2"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <span className="mt-1 block text-xs text-[#a82020]">
              {errors.email.message}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          Password
          <input
            {...register("password")}
            type="password"
            className="field mt-2"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? (
            <span className="mt-1 block text-xs text-[#a82020]">
              {errors.password.message}
            </span>
          ) : null}
        </label>
        {serverMessage ? (
          <p
            className="border border-[#a82020] p-3 text-sm text-[#a82020]"
            role="alert"
          >
            {serverMessage}
          </p>
        ) : null}
        <button
          type="submit"
          className="button-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner size={16} /> : null}
          {isSubmitting
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
