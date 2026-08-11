"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Spinner } from "@/components/motion/spinner";

export function NewsletterForm({
  id,
  dark = false,
}: {
  id: string;
  dark?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setPending(true);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = (await response.json()) as { message?: string };
    setMessage(body.message || "Unable to continue.");
    setPending(false);
  }

  return (
    <div>
      <form
        onSubmit={submit}
        className={`flex border-b ${dark ? "border-white/40" : "border-[#77736b]"}`}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          required
          placeholder="Your email address"
          className={`min-w-0 flex-1 bg-transparent py-4 outline-none ${dark ? "text-white placeholder:text-white/45" : "text-[#171613] placeholder:text-[#77736b]"}`}
        />
        <MagneticButton strength={0.25}>
          <button
            disabled={pending}
            className="inline-flex items-center gap-2 px-3 text-xs font-bold tracking-wider uppercase"
          >
            {pending ? <Spinner size={13} /> : null}
            {pending ? "Please wait…" : "Subscribe"}
          </button>
        </MagneticButton>
      </form>
      {message ? (
        <p
          className={`mt-3 text-xs ${dark ? "text-white/65" : "text-[#6c6961]"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
