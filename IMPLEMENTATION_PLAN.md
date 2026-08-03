# Aylee Next.js Migration Plan

## Findings

- The repository is a Vite 8 / React 19 single-page storefront using hash-based routing.
- Commerce is a custom Laravel/PHP API at `https://admin.aylee.store`, not WooCommerce.
- The public catalog currently exposes five active products, two parent categories, banners, guest cart endpoints, token-based customer endpoints, order creation, and hosted payment-initiation endpoints.
- Product detail currently returns a server error for at least one live slug, so the commerce adapter must fall back to the catalog record.
- Current storefront content contains conflicting free-shipping thresholds and unverified testimonials/store details. Those will not be presented as structured facts without a verified backend source.
- Existing Vite code is preserved under `legacy-vite/` as a migration reference; the production app uses separate App Router entry points and focused component folders.

## Implementation Checklist

- [x] Inspect repository, public storefront, API contracts, assets, auth, cart, order, and payment flows.
- [x] Confirm the backend is a custom Laravel API rather than WooCommerce.
- [x] Replace the Vite toolchain with latest stable Next.js, strict TypeScript, Tailwind CSS, ESLint, and Prettier.
- [x] Add typed commerce, validation, SEO, configuration, and formatting layers.
- [x] Build the shared responsive layout, navigation, search, wishlist, cart, and accessibility foundations.
- [x] Build homepage, shop, collections, categories, product, new-arrivals, sale, and search routes.
- [x] Build cart, checkout, order confirmation, account, orders, and addresses routes.
- [x] Build stores, about, contact, size guide, and policy routes using only verified or clearly labelled content.
- [x] Add metadata, JSON-LD, sitemap, robots, canonicals, redirects, loading, error, and not-found states.
- [x] Add Vitest unit coverage and Playwright critical-journey coverage.
- [x] Complete README, migration notes, performance report, and environment template.
- [x] Run lint, typecheck, unit tests, Playwright checks, and production build; fix all failures.

## Delivery Notes

- Product/category content, prices, inventory, images, and variants come from the live API with resilient empty states.
- Personalized state remains client-side only where needed; secrets and commerce calls are mediated by server-side fetches or same-origin route handlers.
- The existing hosted payment flow is retained; the app will never collect raw card details.
