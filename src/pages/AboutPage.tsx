export function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:py-20">
      <article className="reveal-up signature-pan rounded-[var(--radius-lg)] border border-[var(--line)] p-6 text-[var(--champagne)] sm:p-8 md:p-12">
        <p className="text-xs tracking-[0.3em] text-[var(--gold)]">STORES</p>
        <h1 className="font-editorial mt-4 max-w-3xl text-4xl leading-[1.02] sm:text-5xl">
          Aylee brings fashion-forward everyday wear online and in stores.
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--champagne)]/80">
          This store page is built around the Aylee shopping rhythm: fast
          category discovery, seasonal campaigns, selected stock sales, and
          clear support for customers across Pakistan.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">50k+</p>
            <p className="mt-2 text-xs tracking-[0.2em]">ORDERS DELIVERED</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">4.8</p>
            <p className="mt-2 text-xs tracking-[0.2em]">AVERAGE RATING</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/20 bg-white/10 p-5">
            <p className="font-editorial text-4xl">24H</p>
            <p className="mt-2 text-xs tracking-[0.2em]">SUPPORT RESPONSE</p>
          </div>
        </div>
      </article>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="reveal-up soft-panel rounded-[var(--radius-lg)] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Design First</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Our collections balance trend direction with timeless tailoring so each piece feels wearable beyond a single season.
          </p>
        </article>
        <article className="reveal-up soft-panel rounded-[var(--radius-lg)] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Quality Focus</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            We prioritize fabric handle, finish quality, and fit consistency so online customers can shop with more confidence.
          </p>
        </article>
        <article className="reveal-up soft-panel rounded-[var(--radius-lg)] border border-[var(--line)] p-6">
          <h2 className="font-editorial text-3xl">Nationwide Reach</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Lahore to Karachi, Islamabad to Multan, our storefront is designed for a clean and reliable shopping journey across Pakistan.
          </p>
        </article>
      </div>
    </section>
  );
}
