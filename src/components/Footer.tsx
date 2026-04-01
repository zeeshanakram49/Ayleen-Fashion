import type { Category } from '../types/store';

type FooterProps = {
  categories: Category[];
};

export function Footer({ categories }: FooterProps) {
  return (
    <footer className="glass-shift border-t border-[var(--line)] bg-[var(--panel)]/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-editorial text-3xl font-semibold tracking-[0.22em]">AYLEEN</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Premium fashion house for confident silhouettes and modern daily style across Pakistan.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">SHOP</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {categories.map((cat) => (
              <li key={cat.id}>{cat.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">HELP</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Exchange Policy</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.22em] text-[var(--ink)]/75">FOLLOW</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>TikTok</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
