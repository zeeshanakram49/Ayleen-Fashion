# Migration Notes

## Existing website findings

- Previous frontend: Vite 8 / React 19 SPA with hash routing and a large client-side application shell.
- Backend: custom Laravel/PHP API at `admin.aylee.store`; it is not WooCommerce.
- Public data observed on 2026-08-03: five active products, two parent categories, two banners, customer token endpoints, guest cart endpoints, order creation, and hosted payment initiation.
- The live product-detail endpoint returned HTTP 500 for a tested slug while the list endpoint returned the product successfully.
- Published content contained conflicting free-shipping thresholds (`Rs. 2,500` in the announcement/benefit and `Rs. 6,000` in the previous bag). The repeated published threshold of `Rs. 2,500` is now centralized in `siteConfig`.
- Previous testimonials could not be verified against backend review data and were removed. No rating or AggregateRating schema is emitted.

The retired Vite source is preserved under `legacy-vite/` for reference and is excluded from the Next.js build.

## Migrated routes

The migration includes `/`, `/shop`, `/collections`, `/collections/[slug]`, `/categories/[slug]`, `/products/[slug]`, `/search`, `/new-arrivals`, `/sale`, `/wishlist`, `/cart`, `/checkout`, `/order-confirmation/[orderId]`, `/account`, `/account/orders`, `/account/addresses`, `/stores`, `/about`, `/contact`, `/size-guide`, and all requested policy routes.

Loading, global error, not-found, robots, sitemap, and revalidation handlers are included.

## Redirects

- `/classic-2-columns` → `/shop`
- Legacy hash paths for shop, cart, and wishlist → clean App Router paths where the request reaches the server

Hash fragments are not sent over HTTP, so production analytics should be used to identify any additional legacy URLs needing server-side redirects.

## Backend integration

- Server-first catalog adapter with normalized types and five-minute cache tags
- Catalog fallback for broken product-detail responses
- Audited public catalog snapshot for complete upstream outages
- HTTP-only guest and customer tokens in same-origin handlers
- Local guest cart with backend reconciliation
- Zod-validated checkout and existing hosted payment initiation
- Authenticated order-history proxy

## Known limitations and manual steps

- The backend product-detail endpoint should be repaired; the catalog fallback prevents storefront failure but cannot expose detail-only fields.
- Full legal privacy/terms text was unavailable. Those pages are intentionally marked `Content pending confirmation` and must be replaced by approved legal copy.
- Complete shipping/exchange conditions and verified product measurements must be supplied by Aylee.
- Newsletter signup has no published storage endpoint. The UI validates addresses but explicitly confirms that they were not stored until an integration is configured.
- The backend exposes no documented safe address-update endpoint; checkout can collect a shipping address, but account address mutation remains disabled.
- Payment methods require live gateway credentials and end-to-end sandbox/production verification in the backend.
- Previously tracked `.env` and `.env.development` files should be removed from git history and any real credentials rotated. They are now ignored for future work; `.env.example` contains placeholders only.
- Store locations were reproduced from the public storefront. Opening hours should be confirmed before adding LocalBusiness structured data.
