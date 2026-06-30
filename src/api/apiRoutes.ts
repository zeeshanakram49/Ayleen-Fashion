export const API_ROUTES = {
  auth: {
    login: "/api/login",
    register: "/api/register",
    logout: "/api/logout",
    me: "/api/me",
    forgotPassword: "/api/forgot-password",
    resetPassword: "/api/reset-password",
  },

  catalog: {
    products: "/api/products",
    categories: "/api/categories",
    productBySlug: (slug: string) => `/api/products/${slug}`,
    search: "/api/products/search",
    featured: "/api/products/featured",
  },

  wishlist: {
    list: "/api/wishlist",
    add: "/api/wishlist/add",
    remove: (productId: string) => `/api/wishlist/${productId}`,
    legacyList: "/api/fetch/favorites",
    legacyAdd: "/api/add/favorite",
    legacyRemove: "/api/delete/favorites",
  },

  cart: {
    list: "/api/cart",
    add: "/api/cart/add",
    update: "/api/cart/update",
    remove: "/api/cart/remove",
    clear: "/api/cart/clear",
  },

  orders: {
    create: "/api/orders",
    list: "/api/orders",
    detail: (orderId: string) => `/api/orders/${orderId}`,
    cancel: (orderId: string) => `/api/orders/${orderId}/cancel`,
  },

  payments: {
    stripeCreateSession: "/api/payments/stripe/create-checkout-session",
    stripeVerify: "/api/payments/stripe/verify",
    jazzcashInitiate: "/api/payments/jazzcash/initiate",
    jazzcashVerify: "/api/payments/jazzcash/verify",
    easypaisaInitiate: "/api/payments/easypaisa/initiate",
    easypaisaVerify: "/api/payments/easypaisa/verify",
    paymentStatus: (orderId: string) => `/api/payments/status/${orderId}`,
  },
};
