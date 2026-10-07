export type ContentStatus = "verified" | "pending-confirmation";

export type PolicyContent = {
  slug: string;
  title: string;
  description: string;
  status: ContentStatus;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const policies: Record<string, PolicyContent> = {
  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping policy",
    description: "Delivery information for orders in Pakistan.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Delivery charges",
        paragraphs: [
          "Aylee offers free delivery on orders of Rs. 5,000 or more. For smaller orders, please contact us for the delivery charge before placing your order.",
          "Delivery times depend on your location. Contact Aylee on WhatsApp if you need an estimated arrival date before ordering.",
        ],
      },
    ],
  },
  "exchange-policy": {
    slug: "exchange-policy",
    title: "Exchange policy",
    description: "How to ask Aylee about an exchange.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Request an exchange",
        paragraphs: [
          "Contact Aylee on WhatsApp with your order number and item details before sending anything back. Please keep the item unused with its original tags while your request is reviewed.",
          "Ask our team to confirm the exchange window, eligibility and return courier charge for your order before dispatching a parcel.",
        ],
      },
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy policy",
    description: "Privacy information for the Aylee storefront.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Privacy enquiries",
        paragraphs: [
          "For questions about your personal information or an order, contact Aylee customer service using the details below.",
        ],
      },
    ],
  },
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms and conditions",
    description: "Terms information for the Aylee storefront.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Purchasing enquiries",
        paragraphs: [
          "Contact Aylee customer service for purchasing terms or help with an order.",
        ],
      },
    ],
  },
};
