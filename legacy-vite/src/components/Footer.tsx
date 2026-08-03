import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Lock,
  Check,
} from "lucide-react";
import type { Category } from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

type FooterProps = {
  categories: Category[];
};

const storeLocations = [
  { city: "Lahore", detail: "Gulberg II / Flagship & Emporium Mall" },
  { city: "Islamabad", detail: "F-10 Markaz & Centaurus Mall" },
  { city: "Karachi", detail: "Dolmen Mall Clifton & Lucky One Mall" },
];

export function Footer({ categories }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t border-[var(--line)] bg-[#121212] text-white">
      {/* Value Proposition Bar */}
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div className="flex flex-col items-center">
            <Truck className="mb-2 h-6 w-6 text-white" />
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Free Express Shipping
            </h4>
            <p className="mt-1 text-[11px] text-neutral-400">
              On orders over Rs. 2,500 across Pakistan
            </p>
          </div>
          <div className="flex flex-col items-center">
            <RefreshCw className="mb-2 h-6 w-6 text-white" />
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Hassle-Free Exchange
            </h4>
            <p className="mt-1 text-[11px] text-neutral-400">
              14-day easy returns &amp; size exchanges
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="mb-2 h-6 w-6 text-white" />
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              100% Authentic Quality
            </h4>
            <p className="mt-1 text-[11px] text-neutral-400">
              Premium fabrics &amp; tailored silhouettes
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="mb-2 h-6 w-6 text-white" />
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Secure Checkout
            </h4>
            <p className="mt-1 text-[11px] text-neutral-400">
              COD, Cards, JazzCash &amp; EasyPaisa
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Newsletter Section */}
          <div className="space-y-6 lg:col-span-5">
            <a
              href={getHashUrl(APP_ROUTES.home)}
              className="font-display text-3xl font-extrabold tracking-tighter text-white"
            >
              AYLEE
            </a>
            <p className="max-w-md text-xs leading-relaxed text-neutral-400">
              Aylee is a modern men’s fashion and streetwear brand dedicated to
              high-end silhouettes, durable craftsmanship, and contemporary
              Pakistani luxury aesthetics.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <span className="mb-3 block text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
                Join the Private List
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setSubscribed(true);
                  setEmail("");
                }}
                className="flex max-w-md gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white placeholder-neutral-500 transition outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-1 rounded-xl bg-white px-5 py-3 text-xs font-bold tracking-widest text-black uppercase transition hover:bg-neutral-200"
                >
                  {subscribed ? (
                    <Check size={14} />
                  ) : (
                    <>
                      JOIN <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs font-medium text-emerald-400">
                  Welcome to Aylee! You will get early drop alerts &amp; member
                  discounts.
                </p>
              )}
            </div>
          </div>

          {/* Nav Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
                Shop Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <a
                    href={getHashUrl(APP_ROUTES.shop)}
                    className="transition hover:text-white"
                  >
                    All Men&apos;s Wear
                  </a>
                </li>
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={getHashUrl(APP_ROUTES.shop)}
                      className="transition hover:text-white"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
                Help &amp; Support
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <a
                    href={getHashUrl(APP_ROUTES.contact)}
                    className="transition hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href={getHashUrl(APP_ROUTES.about)}
                    className="transition hover:text-white"
                  >
                    About Aylee
                  </a>
                </li>
                <li>
                  <a
                    href={getHashUrl(APP_ROUTES.account)}
                    className="transition hover:text-white"
                  >
                    Order Tracking
                  </a>
                </li>
                <li>
                  <a
                    href={getHashUrl(APP_ROUTES.contact)}
                    className="transition hover:text-white"
                  >
                    Shipping &amp; Returns Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase">
                Flagship Stores
              </h4>
              <ul className="space-y-3 text-xs text-neutral-400">
                {storeLocations.map((store) => (
                  <li key={store.city}>
                    <strong className="block text-white">{store.city}</strong>
                    <span>{store.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AYLEE STORE. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold text-neutral-300">
              STRIPE
            </span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold text-neutral-300">
              JAZZCASH
            </span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold text-neutral-300">
              EASYPAISA
            </span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold text-neutral-300">
              CASH ON DELIVERY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
