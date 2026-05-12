const launchNotes = ["Shirts edit", "Premium cotton", "Launching soon"];
const previewCards = [
  { title: "Classic cuts", value: "01" },
  { title: "Soft textures", value: "02" },
  { title: "Daily luxury", value: "03" },
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
          <span>SHIRTS COLLECTION</span>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>SHIRTS COLLECTION</span>
        </div>
      </header>

      <section className="coming-soon-hero" aria-labelledby="coming-soon-title">
        <p className="coming-soon-kicker">Ayleen Shirts Collection</p>
        <h1 id="coming-soon-title" className="font-editorial">
          Coming Soon
        </h1>
        <p className="coming-soon-copy">
          Hamari shirts collection tayyar ho rahi hai. Bohat jald AYLEEN ka
          clean, premium aur everyday fashion experience live hoga.
        </p>

        <div className="coming-soon-progress" aria-label="Launch progress">
          <span />
        </div>

        <div className="coming-soon-actions">
          <a href="mailto:hello@ayleenfashion.com">Get notified</a>
          <a href="tel:+923000000000">Contact us</a>
        </div>
      </section>

      <section className="coming-soon-preview" aria-label="Collection preview">
        <div className="coming-soon-shirt-card">
          <span className="shirt-collar" />
          <span className="shirt-placket" />
          <span className="shirt-pocket" />
        </div>
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
          <span>PREMIUM FASHION</span>
          <span>AYLEEN</span>
          <span>COMING SOON</span>
          <span>PREMIUM FASHION</span>
        </div>
      </div>
    </main>
  );
}

export default App;
