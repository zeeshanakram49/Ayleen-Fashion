import type { Category } from '../types/store';

type FooterProps = {
  categories: Category[];
};

export function Footer({ categories }: FooterProps) {
  return (
    <footer className="glass-shift border-t border-[var(--line)] bg-[var(--panel)]/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-editorial text-3xl font-semibold tracking-[0.22em]">AYLEEN</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Premium fashion house for confident silhouettes and modern daily style across Pakistan.
          </p>
          <div className="mt-5 space-y-2 text-sm text-[var(--muted)]">
            <p>support@ayleen.pk</p>
            <p>+92 300 1234567</p>
            <p>MM Alam Road, Lahore</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">SHOP</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {categories.map((cat) => (
              <li key={cat.id}>
                <a href={`#/shop`} className="transition hover:text-[var(--gold-deep)]">
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">HELP</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>
              <a href="#/contact" className="transition hover:text-[var(--gold-deep)]">
                Contact Us
              </a>
            </li>
            <li>Shipping Policy</li>
            <li>Exchange Policy</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">FOLLOW</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>Instagram / @ayleen.pk</li>
            <li>Facebook / AYLEEN Pakistan</li>
            <li>TikTok / @ayleenstudio</li>
            <li>Pinterest / AYLEEN Moodboard</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)] px-6 py-4 text-center text-xs tracking-[0.18em] text-[var(--muted)]">
        © 2026 AYLEEN. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
