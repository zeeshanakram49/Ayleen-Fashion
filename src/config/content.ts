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
    description: "A summary of currently published Aylee delivery information.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Published summary",
        paragraphs: [
          "Aylee currently advertises nationwide delivery in Pakistan and free delivery on qualifying orders above Rs. 2,500.",
          "A complete delivery timetable, service-area list, and exception policy was not available from the source website. Contact customer service before ordering if timing is critical.",
        ],
      },
    ],
  },
  "exchange-policy": {
    slug: "exchange-policy",
    title: "Exchange policy",
    description: "A summary of currently published Aylee exchange information.",
    status: "pending-confirmation",
    sections: [
      {
        heading: "Published summary",
        paragraphs: [
          "The source storefront states that unused articles with original tags may receive exchange support within seven days.",
          "Eligibility details, exclusions, return shipping responsibility, and the exchange process were not fully published. Contact customer service before returning an item.",
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
        heading: "Content pending confirmation",
        paragraphs: [
          "A complete verified privacy notice could not be retrieved from the source website. This page is intentionally not populated with invented legal terms.",
          "For questions about personal data, contact Aylee customer service using the details below.",
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
        heading: "Content pending confirmation",
        paragraphs: [
          "Verified full terms and conditions were not available from the source website. This page is a clearly labelled placeholder and does not create or replace Aylee's legal terms.",
          "Contact customer service for current purchasing terms before placing an order.",
        ],
      },
    ],
  },
};
