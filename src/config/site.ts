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
  announcement: "Free shipping on orders above Rs. 5,000",
  freeShippingThreshold: 2500,
  contact: {
    email: "support@aylee.pk",
    whatsappDisplay: "+92 42 35467243",
    whatsappHref: "https://wa.me/924235467243",
    hours: "09:00 AM to 09:00 PM (PST), Monday to Saturday",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
  stores: [
    {
      city: "Lahore",
      locations: ["Gulberg II / Flagship", "Emporium Mall / Level 3"],
    },
    {
      city: "Islamabad",
      locations: ["F-10 Markaz / Retail Store", "Centaurus Mall / Level 2"],
    },
    {
      city: "Karachi",
      locations: [
        "Dolmen Mall Clifton / Ground Floor",
        "Lucky One Mall / Ground Floor",
      ],
    },
  ],
  navigation: [
    { href: "/shop", label: "Men" },
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/sale", label: "Sale" },
    { href: "/stores", label: "Stores" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
