const launchNotes = ["Shirts", "Perfumes", "Trousers"];
const previewCards = [
  { title: "Premium shirts", value: "01" },
  { title: "Signature perfumes", value: "02" },
  { title: "Tailored trousers", value: "03" },
];

function App() {
  return (
    <main className="coming-soon-page">
      <div className="coming-soon-backdrop" aria-hidden="true" />
      <div className="coming-soon-grain" aria-hidden="true" />
      <div className="coming-soon-stitches" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="coming-soon-topbar" aria-hidden="true">
        <div>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>SHIRTS / PERFUMES / TROUSERS</span>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>SHIRTS / PERFUMES / TROUSERS</span>
        </div>
      </header>

      <section className="coming-soon-hero" aria-labelledby="coming-soon-title">
        <p className="coming-soon-brand">AYLEEN</p>
        <p className="coming-soon-kicker">Ayleen Fashion & Fragrance</p>
        <h1 id="coming-soon-title" className="font-editorial">
          Coming Soon
        </h1>
        <p className="coming-soon-copy">
          Our shirts, perfumes, and trousers are being crafted with care.
          AYLEEN's clean, premium everyday fashion experience will be live very
          soon.
        </p>

        <div className="coming-soon-status" aria-label="Launch status">
          <span>Launch preparation</span>
          <span>76%</span>
        </div>

        <div className="coming-soon-progress" aria-hidden="true">
          <span />
        </div>

        <div className="coming-soon-actions">
          <a href="mailto:hello@ayleenfashion.com">Get notified</a>
          <a href="tel:+923004616865">0300 4616865</a>
          <a href="tel:+923034965359">0303 4965359</a>
        </div>

        <div className="coming-soon-details" aria-label="Collection details">
          <span>Clean shirts</span>
          <span>Signature scents</span>
          <span>Tailored trousers</span>
          <span>Limited first release</span>
        </div>
      </section>

      <section className="coming-soon-preview" aria-label="Collection preview">
        <div className="coming-soon-card-stack">
          {previewCards.map((card) => (
            <article key={card.title}>
              <span>{card.value}</span>
              <p>{card.title}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="coming-soon-panel" aria-label="Launch highlights">
        {launchNotes.map((note) => (
          <span key={note}>{note}</span>
        ))}
      </aside>

      <div className="coming-soon-marquee" aria-hidden="true">
        <div>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>FASHION & FRAGRANCE</span>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>FASHION & FRAGRANCE</span>
        </div>
      </div>
    </main>
  );
}

export default App;
