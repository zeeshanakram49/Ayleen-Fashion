# Aylee Storefront

A production-oriented headless storefront for [Aylee](https://aylee.store), built with Next.js 16 App Router and the existing custom Laravel commerce API.

## Technology

- Next.js 16.2.11, React 19, App Router, and React Server Components
- Strict TypeScript and ESLint Core Web Vitals rules
- Tailwind CSS 4 with a small project design system
- Zod and React Hook Form for validated forms
- Next.js Metadata API, JSON-LD, sitemap, robots, and canonical URLs
- Vitest unit tests and Playwright desktop/mobile journeys

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable                             | Visibility  | Purpose                                                                       |
| ------------------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | Public      | Canonical production URL, normally `https://aylee.store`                      |
| `COMMERCE_API_URL`                   | Server only | Custom Laravel API origin, normally `https://admin.aylee.store`               |
| `COMMERCE_API_TOKEN`                 | Server only | Optional backend-to-backend token if protected catalog operations are enabled |
| `REVALIDATION_SECRET`                | Server only | Secret for `/api/revalidate` webhook calls                                    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public      | Optional; only needed if the backend returns a client-side Stripe flow        |

Never prefix commerce secrets with `NEXT_PUBLIC_`. Local `.env` files are ignored; only `.env.example` should be committed.

## Commands

```bash
npm run dev          # development server
npm run lint         # ESLint
npm run typecheck    # strict TypeScript
npm run test         # Vitest unit suite
npm run test:e2e     # Playwright desktop and mobile suite
npm run build        # optimized production build
npm run start        # serve the production build
```

Playwright browsers can be installed with `npx playwright install chromium webkit`.

## Commerce backend

The source is a custom Laravel/PHP API, not WooCommerce. The typed adapter lives in `src/lib/commerce` and normalizes the public API’s nested response shapes. Catalog requests use five-minute revalidation and cache tags. Product-detail failures fall back to the matching catalog record; total API failure falls back to a dated, read-only snapshot of the real public catalog in `fallback.ts`.

Guest cart changes are persisted on-device and reconciled through same-origin route handlers using an HTTP-only guest token. Customer sessions are stored in secure HTTP-only cookies. Checkout validates all input server-side and forwards orders to the existing backend; non-COD methods use hosted payment initiation and never collect raw card details.

## Images

Remote images are allowed only from `admin.aylee.store`. Product cards request backend thumbnails with fixed aspect-ratio containers, responsive `sizes`, and lazy loading below the fold. The hero is the only preloaded image. Next.js generates AVIF/WebP where supported.

## Caching and revalidation

- Catalog, categories, banners, products, collections, sitemap: ISR with a five-minute default
- Stable information pages: statically generated
- Account, cart synchronization, checkout, and search suggestions: dynamic/no-store where personalized
- Webhook invalidation: `POST /api/revalidate` with `x-revalidation-secret`

Example payload:

```json
{ "tags": ["products", "categories", "banners"] }
```

## SEO

Every indexable route has canonical metadata and social tags. Product pages emit truthful Product/Offer and BreadcrumbList JSON-LD without fabricated ratings. The homepage emits Organization and WebSite/SearchAction data. `sitemap.ts`, `robots.ts`, custom 404/error pages, and legacy redirects are included.

## Vercel deployment

1. Import the repository into Vercel.
2. Add the environment variables above for Production and Preview.
3. Keep the framework preset as Next.js and the build command as `npm run build`.
4. Configure the commerce backend to allow the deployed domain where browser-origin policy applies.
5. Configure the backend product/category webhook to call `/api/revalidate` after setting `REVALIDATION_SECRET`.
6. Verify hosted payment success/cancel URLs and gateway credentials in the backend environment.

See [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) and [PERFORMANCE_REPORT.md](./PERFORMANCE_REPORT.md) for implementation details and remaining content work.
