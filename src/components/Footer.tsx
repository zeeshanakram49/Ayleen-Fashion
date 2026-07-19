import { useState } from "react";
import type { Category } from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

type FooterProps = {
  categories: Category[];
};

const storeLocations = [
  {
    city: "Lahore",
    locations: ["Gulberg II / Flagship", "Emporium Mall / Level 3"],
  },
  {
    city: "Islamabad",
    locations: ["F-10 Markaz / Retail Store", "Centaurus Mall / Level 2"],
  },
  {
    city: "Karachi",
    locations: ["Dolmen Mall Clifton / Ground Floor", "Lucky One Mall / Ground Floor"],
  },
];

export function Footer({ categories }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[var(--gold-deep)]">
              SIGN UP AND SAVE
            </p>
            <h2 className="font-editorial mt-4 max-w-lg text-4xl leading-tight sm:text-5xl">
              Join the Aylee list for new drops, sale alerts, and private offers.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
              Get early access to product drops, selected stock markdowns,
              and online exclusives from Aylee.
            </p>

            <form
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) return;
                setSubscribed(true);
                setEmail("");
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (subscribed) setSubscribed(false);
                }}
                placeholder="Enter your email"
                className="footer-input h-14 flex-1 rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--paper)] px-5 text-sm outline-none"
              />
              <button
                type="submit"
                className="footer-submit h-14 rounded-[var(--radius-sm)] bg-[var(--ink)] px-7 text-[11px] font-semibold tracking-[0.18em] text-[var(--paper)]"
              >
                SUBSCRIBE
              </button>
            </form>

            <p className="mt-3 min-h-6 text-sm text-[var(--muted)]">
              {subscribed
                ? "Thanks. You are on the list for new drops and editorial updates."
                : "Expect early access to launches, sale previews, and curated edits."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold tracking-[0.18em]">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2"
              >
                INSTAGRAM
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2"
              >
                FACEBOOK
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-4 py-2"
              >
                TIKTOK
              </a>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6">
              <h3 className="text-[11px] font-semibold tracking-[0.28em] text-[var(--gold-deep)]">
                CUSTOMER SERVICE
              </h3>
              <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <p>
                  Email:
                  {" "}
                  <a href="mailto:support@aylee.pk">support@aylee.pk</a>
                </p>
                <p>
                  WhatsApp:
                  {" "}
                  <a href="tel:+924235467243">+92 42 35467243</a>
                </p>
                <p>09:00 AM to 09:00 PM (PST)</p>
                <p>Monday to Saturday</p>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-6">
              <h3 className="text-[11px] font-semibold tracking-[0.28em] text-[var(--gold-deep)]">
                SHOP
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
                {categories.map((category) => (
                  <a key={category.id} href={getHashUrl(`${APP_ROUTES.shop}?category_id=${category.id}`)} className="transition hover:text-[var(--ink)]">
                    {category.name}
                  </a>
                ))}
                <a href={getHashUrl(APP_ROUTES.about)} className="transition hover:text-[var(--ink)]">
                  About
                </a>
                <a href={getHashUrl(APP_ROUTES.contact)} className="transition hover:text-[var(--ink)]">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--ink)] p-6 text-[var(--paper)] sm:p-7">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[var(--gold)]">
              STORE LOCATION
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {storeLocations.map((location) => (
                <article
                  key={location.city}
                  className="rounded-[var(--radius-md)] border border-white/12 bg-white/6 p-4"
                >
                  <h3 className="font-editorial text-3xl">{location.city}</h3>
                  <div className="mt-3 space-y-2 text-sm text-[var(--paper)]/70">
                    {location.locations.map((entry) => (
                      <p key={entry}>{entry}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-6 sm:p-7">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[var(--gold-deep)]">
              POLICIES
            </p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-[var(--muted)] sm:grid-cols-2">
              <p>Nationwide express delivery on qualifying orders.</p>
              <p>7-day exchange support for unused articles.</p>
              <p>Secure checkout with COD, JazzCash, EasyPaisa, and cards.</p>
              <p>Responsive support for sizing and gifting queries.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] px-6 py-4 text-center text-[11px] tracking-[0.18em] text-[var(--muted)]">
        © 2026 AYLEE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
