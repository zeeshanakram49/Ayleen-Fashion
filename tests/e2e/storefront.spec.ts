import { expect, test } from "@playwright/test";

const pageErrors = new WeakMap<import("@playwright/test").Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page) || []).toEqual([]);
});

async function openReady(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await page.locator("html[data-store-ready='true']").waitFor();
}

test("homepage loads and primary navigation works", async ({ page }) => {
  await openReady(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const categoryGrid = page.locator(".category-grid");
  await categoryGrid.scrollIntoViewIfNeeded();
  await expect(categoryGrid).toHaveCSS("opacity", "1");
  const shopLink = page.getByRole("link", { name: "Shop", exact: true });
  if (await shopLink.isVisible()) {
    await shopLink.click();
  } else {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("dialog", { name: "Mobile navigation" })
      .getByRole("link", { name: "Shop", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/shop/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Shop all");
});

test("search returns a catalog product", async ({ page }) => {
  await openReady(page, "/search?q=Relaxed");
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});

test("filters stay in the URL", async ({ page }) => {
  await openReady(page, "/shop");
  await page.getByLabel("Category").selectOption("t-shirts");
  await expect(page).toHaveURL(/category=t-shirts/);
});

test("product variant, cart quantity, removal, and checkout journey", async ({
  page,
}) => {
  await openReady(page, "/products/relaxed-t-shirt");
  await page.getByRole("button", { name: "M", exact: true }).click();
  const colourOptions = page.getByRole("group", { name: "Colour" });
  if (await colourOptions.isVisible()) {
    await colourOptions.getByRole("button").first().click();
  }
  await page.getByTestId("add-to-cart").click();
  await expect(
    page.getByRole("dialog", { name: "Shopping bag" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View full bag" }).click();
  await expect(
    page.getByRole("heading", { name: "Shopping bag" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Increase Relaxed T Shirt quantity/ })
    .click();
  await page.getByRole("link", { name: /Continue to checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(
    page.getByRole("heading", { name: "Complete your order" }),
  ).toBeVisible();
  const orderSummaryToggle = page.getByRole("button", { name: /Your bag/ });
  await expect(orderSummaryToggle).toHaveAttribute("aria-expanded", "true");
  await orderSummaryToggle.click();
  await expect(page.locator("#checkout-order-summary")).toBeHidden();
  await orderSummaryToggle.click();
  await expect(page.locator("#checkout-order-summary")).toBeVisible();
  await expect(page.getByText("VISA", { exact: true })).toBeVisible();
});

test("mobile menu and policy pages are accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openReady(page, "/");

  await page.getByRole("button", { name: "Search" }).click();
  await expect(
    page.getByRole("dialog", { name: "Search products" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close search" }).click();

  await page.getByRole("button", { name: /Shopping bag with/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Shopping bag" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close bag" }).click();

  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileMenu = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Stores", exact: true }).click();
  await expect(page).toHaveURL(/\/stores/);
  await openReady(page, "/shipping-policy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Shipping policy",
  );
});

test("pages expose basic accessibility landmarks", async ({ page }) => {
  await openReady(page, "/");
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.locator("img:not([alt])")).toHaveCount(0);
});
