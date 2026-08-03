export const commerceConfig = {
  apiUrl: (process.env.COMMERCE_API_URL || "https://admin.aylee.store").replace(
    /\/$/,
    "",
  ),
  revalidateSeconds: 300,
  requestTimeoutMs: 12_000,
  endpoints: {
    products: "/api/products",
    product: (slug: string) => `/api/products/${encodeURIComponent(slug)}`,
    categories: "/api/categories",
    banners: "/api/banners",
    cart: "/api/cart",
    cartAdd: "/api/add/to/cart",
    cartUpdate: "/api/cart/update",
    cartRemove: "/api/cart/remove",
    checkout: "/api/checkout/place-order",
    wishlist: "/api/wishlist",
    wishlistAdd: "/api/wishlist/add",
    wishlistRemove: (productId: string) =>
      `/api/wishlist/${encodeURIComponent(productId)}`,
    login: "/api/login",
    register: "/api/register",
    logout: "/api/logout",
    me: "/api/me",
    orders: "/api/orders",
    payment: {
      card: "/api/payments/stripe/create-checkout-session",
      jazzcash: "/api/payments/jazzcash/initiate",
      easypaisa: "/api/payments/easypaisa/initiate",
    },
  },
} as const;

export function commerceUrl(path: string): string {
  return `${commerceConfig.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
