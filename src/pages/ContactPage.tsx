export function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="reveal-up soft-panel rounded-[2rem] border border-[var(--line)] p-7">
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">GET IN TOUCH</p>
          <h1 className="font-editorial mt-3 text-5xl leading-[0.95]">Let us style your next look.</h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            For order help, bulk collaborations, or fashion consulting, message us and our team will get back within 24 hours.
          </p>
          <div className="mt-7 space-y-3 text-sm">
            <p><span className="font-semibold">Phone:</span> +92 300 1234567</p>
            <p><span className="font-semibold">Email:</span> support@ayleen.pk</p>
            <p><span className="font-semibold">Address:</span> MM Alam Road, Lahore</p>
          </div>
        </article>

        <form className="reveal-up delay-1 soft-panel rounded-[2rem] border border-[var(--line)] p-7">
          <h2 className="font-editorial text-3xl">Contact Form</h2>
          <div className="mt-5 grid gap-4">
            <input placeholder="Name" className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none" />
            <input placeholder="Email" className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none" />
            <input placeholder="Phone" className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm outline-none" />
            <textarea placeholder="Message" className="min-h-28 rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm outline-none" />
            <button type="button" className="rounded-full bg-[var(--ink)] px-7 py-3 text-xs tracking-[0.2em] text-[var(--champagne)]">
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
