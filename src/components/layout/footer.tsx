import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const shopLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/new-arrivals", label: "New arrivals" },
  { href: "/sale", label: "Sale" },
  { href: "/size-guide", label: "Size guide" },
];

const helpLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/stores", label: "Stores" },
  { href: "/shipping-policy", label: "Shipping policy" },
  { href: "/exchange-policy", label: "Exchange policy" },
];

export function Footer() {
  return (
    <footer className="bg-[#171613] text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.25fr] lg:py-24">
        <div>
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Considered everyday clothing, available online and at Aylee stores
            across Pakistan.
          </p>
        </div>
        <div>
          <h2 className="eyebrow !text-white/55">Shop</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white/60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow !text-white/55">Customer care</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white/60">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow !text-white/55">Stay in the loop</h2>
          <p className="mt-5 text-sm leading-6 text-white/65">
            New drops, selected offers, and store updates.
          </p>
          <div className="mt-5">
            <NewsletterForm id="footer-email" dark />
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
