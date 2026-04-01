export function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <article className="reveal-up signature-pan rounded-[2rem] border border-[var(--line)] p-8 text-[var(--champagne)] md:p-12">
        <p className="text-xs tracking-[0.3em] text-[var(--gold)]">OUR STORY</p>
        <h1 className="font-editorial mt-4 max-w-3xl text-5xl leading-[0.95]">
          AYLEEN builds modern Pakistani fashion with premium craftsmanship.
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--champagne)]/80">
          Founded in Lahore, AYLEEN started with one mission: make elegant, high-quality clothing accessible for daily confidence. From fabric sourcing to fit testing, every drop is designed by our in-house studio with attention to finish, comfort, and timeless silhouettes.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">50k+</p>
            <p className="mt-2 text-xs tracking-[0.2em]">ORDERS DELIVERED</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">4.8</p>
            <p className="mt-2 text-xs tracking-[0.2em]">AVERAGE RATING</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">24H</p>
            <p className="mt-2 text-xs tracking-[0.2em]">SUPPORT RESPONSE</p>
          </div>
        </div>
      </article>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="reveal-up soft-panel rounded-[1.8rem] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Design First</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Our collections balance trend direction with timeless tailoring so each piece feels wearable beyond a single season.
          </p>
        </article>
        <article className="reveal-up soft-panel rounded-[1.8rem] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Quality Focus</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            We prioritize fabric handle, finish quality, and fit consistency so online customers can shop with more confidence.
          </p>
        </article>
        <article className="reveal-up soft-panel rounded-[1.8rem] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Nationwide Reach</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Lahore to Karachi, Islamabad to Multan, our storefront is designed for a clean and reliable shopping journey across Pakistan.
          </p>
        </article>
      </div>
    </section>
  );
}
