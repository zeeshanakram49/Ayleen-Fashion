# Performance Report

## Architecture

- React Server Components are the default. Client components are limited to navigation overlays, cart/wishlist state, filters, product selection/gallery, and forms.
- Stable pages are statically generated; catalog surfaces use five-minute ISR; personalized API handlers opt out of caching.
- Catalog functions deduplicate upstream requests with Next.js data caching and cache tags.
- The homepage requests a bounded featured set rather than rendering a client-fetched full catalog.

## Image strategy

- Next/Image is used for every active storefront image.
- Remote images are restricted to the commerce host.
- Fixed 4:5 product containers prevent layout shift.
- Product cards use backend thumbnails and responsive `sizes`.
- Only the main homepage hero is preloaded; above-fold catalog and product images use eager loading without global preloading.
- Below-fold images remain lazy and Next.js negotiates AVIF/WebP.
- Expanded product imagery is mounted only when the full-screen dialog opens.

## JavaScript and bundle decisions

- Removed Axios, Framer Motion, Stripe.js, and the Vite runtime from the active application.
- Replaced the previous all-client SPA/router with route-level server rendering and streaming boundaries.
- Avoided carousels, animation frameworks, client data-fetching libraries, and global state dependencies.
- Search suggestions use a 280 ms debounce and abort stale requests.

## Caching

- Products, categories, banners: 300 seconds with cache tags
- Sitemap: generated from the catalog and revalidated
- Policy/about/contact/store pages: static
- Account/cart/checkout handlers: no-store and same-origin
- `/api/revalidate`: secret-protected tag invalidation

## Validation results

- Strict TypeScript: passed
- ESLint with zero warnings: passed
- Vitest: 11/11 passed
- Playwright desktop + mobile: 12/12 passed
- Next.js production build: passed (32 generated routes/handlers)
- Production dependency audit: 0 vulnerabilities (`npm audit --omit=dev`)

## Remaining measurement work

Run Lighthouse against the deployed Vercel URL from representative Pakistan network conditions. Local scores would not include real CDN behavior, upstream latency, or production image-cache warmth. Track LCP, CLS, and INP in production and adjust the hero crop/quality if real-user LCP exceeds 2.5 seconds.
