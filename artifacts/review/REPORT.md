# AYLEE storefront review — 7 October 2026

Preview: http://localhost:3000 (run `npm run dev` if the local server is stopped). Production has not been deployed.

## Completed

- Desktop banner keeps the source artwork visible; its sale area links to `/sale`. Mobile uses visible HTML offer text and CTA. The hero image loads directly without lazy loading.
- Homepage product sections no longer repeat the same IDs. Empty reviews and unverified store addresses are hidden. Customer-facing developer wording was removed from policies, product, cart, account and confirmation pages.
- Product pages show COD, delivery threshold, exchange help and WhatsApp size help near buying controls. Optional fabric, fit, care, model size and video fields render only when supplied by the product API. Other versions of the same design link together without changing IDs or URLs.
- Buy Now takes a selected variant to checkout without opening the bag drawer. Shipping is shown as unavailable below the threshold, and the exact payable total is withheld; online submission is paused until a genuine pre-order quote can be integrated.
- Existing Meta events remain in place. No live order was created.

## Blockers and information needed from AYLEE

1. A pre-order backend quote endpoint or approved rate table returning address/city delivery charge, discount and final payable amount, plus confirmation that the Rs. 5,000 free-shipping threshold matches backend rules. This is required to resume checkout and test validation and Purchase totals end to end.
2. Delivery charge by city/area, delivery time or range, exceptions, exchange window, eligibility/exclusions, exchange steps and who pays return courier charges.
3. Owner-approved physical branch names, full addresses and opening hours. Six previously listed locations were removed from customer-facing pages pending confirmation.
4. Product-specific fabric composition, fit, washing instructions and model size. The public API has no separate fields for these on any of 14 products.
5. Size charts for `silverline-classic-polo` and `white-signature-polo`. All 14 products have 4–11 photos, but the API does not label front/back/fabric-detail angles; AYLEE should identify or provide missing angles. No product video is present in the API for any of the 14 products.
6. Owner-approved full privacy notice and purchasing terms if these pages should contain detailed legal policies.

## Verification

- `npm run typecheck`, focused ESLint, `npm run test -- tests/unit/commerce.test.ts` (15 passed), and `npm run build` passed.
- Browser checks at 1440 px and 390 px: no horizontal overflow; product size and colour selection, Add to Bag, quantity changes, Buy Now, checkout block, size guide and shipping/exchange pages checked. No order submitted.
- The repository Playwright runner could not claim port 3000 because a preview was already running; equivalent focused browser checks used that preview.

## Screenshots

- [Before desktop](before-desktop.png) · [After desktop](after-desktop.png)
- [Before mobile](before-mobile.png) · [After mobile](after-mobile.png)
- [Checkout mobile](after-checkout-mobile.png)

## Changed files

`src/app/page.tsx`, `src/app/globals.css`, `src/components/home/hero-slider.tsx`, `src/app/products/[slug]/page.tsx`, `src/components/product/product-purchase.tsx`, `src/components/providers/store-provider.tsx`, `src/lib/commerce/products.ts`, `src/types/commerce.ts`, `src/components/forms/checkout-form.tsx`, `src/config/content.ts`, `src/config/site.ts`, `src/components/common/policy-page.tsx`, `src/app/stores/page.tsx`, `src/app/about/page.tsx`, `src/components/layout/footer.tsx`, `src/components/cart/cart-page-view.tsx`, `src/app/checkout/page.tsx`, `src/app/order-confirmation/[orderId]/page.tsx`, `src/app/account/addresses/page.tsx`, `src/components/account/account-panel.tsx`, `src/components/account/orders-view.tsx`, `src/app/api/newsletter/route.ts`, `src/components/product/catalog-pagination.tsx`, `tests/e2e/storefront.spec.ts`.

`next-env.d.ts` was already modified before this work and was not edited for this task.
