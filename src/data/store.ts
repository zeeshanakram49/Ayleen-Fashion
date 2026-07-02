import type { CheckoutState, Service, Testimonial } from "../types/store";
import { APP_ROUTES } from "../routes/appRoutes";
import { getHashUrl } from "../routes/routeUtils";

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
