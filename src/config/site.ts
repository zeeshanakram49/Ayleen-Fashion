export const siteConfig = {
  name: "Aylee",
  legalName: "Aylee",
  domain: "aylee.store",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://aylee.store").replace(
    /\/$/,
    "",
  ),
  locale: "en_PK",
  currency: "PKR",
  currencyLabel: "Rs.",
  description:
    "Shop the latest Aylee clothing collection with secure checkout and nationwide delivery across Pakistan.",
  announcement: "Free shipping on orders of Rs. 5,000 or more",
  freeShippingThreshold: 5000,
  shippingFee: 250,
  contact: {
    email: "aylynasir@gmail.com",
    whatsappDisplay: "03088984000",
    whatsappHref: "https://wa.me/923088984000",
    hours: "09:00 AM to 09:00 PM (PST), Monday to Saturday",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
  navigation: [
    { href: "/shop?gender=male", label: "Men" },
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/sale", label: "Sale" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
