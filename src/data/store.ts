import type {
  Category,
  CheckoutState,
  Product,
  Service,
  Testimonial,
} from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

export const categories: Category[] = [
  {
    id: "men",
    name: "Men",
    subtitle: "Textured polos and knit henleys",
    items: 6,
    image: "/products/product_06_website_square_1600.jpg",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "sand-textured-knit-polo",
    title: "Sand Textured Knit Polo",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "new-in", "sale", "shirt", "textured", "polo", "knit", "sand"],
    fit: "Regular Fit",
    price: 3990,
    oldPrice: 4990,
    badge: "New In",
    image: "/products/product_06_website_square_1600.jpg",
    gallery: [
      "/products/product_06_website_square_1600.jpg",
      "/products/product_01_website_square_1600.jpg",
      "/products/product_06_off_white.jpg",
      "/products/product_01_off_white.jpg",
    ],
    colors: ["Sand"],
    description: "Soft textured polo with a clean collar and easy everyday shape.",
    details:
      "Breathable knit texture, ribbed sleeves and hem, and a polished casual profile for daily wear.",
    material: "Textured Knit",
    stock: 24,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 18,
  },
  {
    id: "p2",
    slug: "ice-textured-knit-henley",
    title: "Ice Textured Knit Henley",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "new-in", "shirt", "textured", "henley", "knit", "ice"],
    fit: "Regular Fit",
    price: 4190,
    oldPrice: 5290,
    badge: "New In",
    image: "/products/product_02_website_square_1600.jpg",
    gallery: [
      "/products/product_02_website_square_1600.jpg",
      "/products/product_03_website_square_1600.jpg",
      "/products/product_02_off_white.jpg",
      "/products/product_03_off_white.jpg",
    ],
    colors: ["Ice"],
    description: "Lightweight textured henley with a soft grey tone and relaxed polish.",
    details:
      "Open knit texture, short sleeves, ribbed hem, and a neat button placket for smart casual styling.",
    material: "Textured Knit",
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 15,
  },
  {
    id: "p3",
    slug: "olive-textured-knit-polo",
    title: "Olive Textured Knit Polo",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "new-in", "sale", "shirt", "textured", "polo", "knit", "olive"],
    fit: "Regular Fit",
    price: 3990,
    oldPrice: 4990,
    badge: "Sale",
    image: "/products/product_04_website_square_1600.jpg",
    gallery: [
      "/products/product_04_website_square_1600.jpg",
      "/products/product_05_website_square_1600.jpg",
      "/products/product_04_off_white.jpg",
      "/products/product_05_off_white.jpg",
    ],
    colors: ["Olive"],
    description: "Deep olive textured polo made for clean daily dressing.",
    details:
      "Soft knit body, button collar, ribbed sleeve opening, and an easy fit that pairs well with chinos.",
    material: "Textured Knit",
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 21,
  },
  {
    id: "p4",
    slug: "sand-knit-polo-side-edit",
    title: "Sand Knit Polo Side Edit",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "sale", "shirt", "textured", "polo", "knit", "sand"],
    fit: "Easy Fit",
    price: 3890,
    oldPrice: 4890,
    badge: "Sale",
    image: "/products/product_01_website_square_1600.jpg",
    gallery: [
      "/products/product_01_website_square_1600.jpg",
      "/products/product_06_website_square_1600.jpg",
      "/products/product_01_off_white.jpg",
      "/products/product_06_off_white.jpg",
    ],
    colors: ["Sand"],
    description: "Sand knit polo with a relaxed side profile and soft textured handle.",
    details:
      "Comfortable knit construction with ribbed edges, a polished collar, and breathable everyday weight.",
    material: "Textured Knit",
    stock: 16,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 12,
  },
  {
    id: "p5",
    slug: "ice-knit-henley-side-edit",
    title: "Ice Knit Henley Side Edit",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "shirt", "textured", "henley", "knit", "ice"],
    fit: "Easy Fit",
    price: 4090,
    oldPrice: 5190,
    badge: "Limited",
    image: "/products/product_03_website_square_1600.jpg",
    gallery: [
      "/products/product_03_website_square_1600.jpg",
      "/products/product_02_website_square_1600.jpg",
      "/products/product_03_off_white.jpg",
      "/products/product_02_off_white.jpg",
    ],
    colors: ["Ice"],
    description: "Ice grey henley with a clean side cut and airy knit texture.",
    details:
      "Soft knitted texture, neat sleeve finish, and a minimal neckline built for warm-weather layering.",
    material: "Textured Knit",
    stock: 14,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 10,
  },
  {
    id: "p6",
    slug: "olive-knit-polo-side-edit",
    title: "Olive Knit Polo Side Edit",
    categoryId: "men",
    categoryLabel: "Men",
    tags: ["men", "sale", "shirt", "textured", "polo", "knit", "olive"],
    fit: "Easy Fit",
    price: 3890,
    oldPrice: 4890,
    badge: "Sale",
    image: "/products/product_05_website_square_1600.jpg",
    gallery: [
      "/products/product_05_website_square_1600.jpg",
      "/products/product_04_website_square_1600.jpg",
      "/products/product_05_off_white.jpg",
      "/products/product_04_off_white.jpg",
    ],
    colors: ["Olive"],
    description: "Olive textured polo with a soft drape and refined casual finish.",
    details:
      "Breathable knit body, relaxed side profile, ribbed trims, and a comfortable collar for daily wear.",
    material: "Textured Knit",
    stock: 17,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 14,
  },
];

export const services: Service[] = [
  {
    title: "Nationwide Delivery",
    detail: "Free delivery across Pakistan above PKR 2,500.",
  },
  {
    title: "Easy Exchange",
    detail: "Exchange support for unused articles with original tags.",
  },
  {
    title: "Secure Checkout",
    detail: "COD, JazzCash, EasyPaisa, and card payment options.",
  },
  {
    title: "Online & In Stores",
    detail: "Shop campaign drops online or visit your nearest retail store.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Nasir Mehmood",
    city: "Lahore",
    quote:
      "Fabric quality is honestly premium. Fits came exactly as shown and delivery was super fast.",
  },
  {
    name: "Zeeshan Akram",
    city: "Lahore",
    quote:
      "The men collection has clean cuts and smart stitching. Great for office and evening both.",
  },
  {
    name: "Ayesha Nasir",
    city: "Lahore",
    quote:
      "Packaging, quality and support team all feel professional. My go-to brand for gifting now.",
  },
];

export const navLinks = [
  { href: getHashUrl(APP_ROUTES.home), label: "HOME" },
  { href: getHashUrl(APP_ROUTES.shop), label: "SHOP" },
  { href: getHashUrl(APP_ROUTES.about), label: "STORES" },
  { href: getHashUrl(APP_ROUTES.contact), label: "CONTACT" },
];

export const initialCheckout: CheckoutState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  payment: "COD",
  note: "",
};
