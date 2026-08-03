import type { Banner, Category, Product } from "@/types/commerce";

// Read-only snapshot of public API fields retrieved on 2026-08-03.
// This is used only when the live commerce service is unavailable; it contains
// no invented products, prices, reviews, policies, or availability claims.
export const fallbackCategories: Category[] = [
  {
    id: "1",
    slug: "polo",
    name: "Polo",
    description:
      "This knitted shirt features a maple collar, button-up closure, short sleeves and label patch detail on one sleeve.",
    image:
      "https://admin.aylee.store/uploads/category/2026/07/fvyF4JNMXhecrtBWBm2W_06_862622122d6639be075773a905542eba_image.png",
    gender: "male",
    parentId: null,
    children: [],
  },
  {
    id: "2",
    slug: "t-shirts",
    name: "T-Shirts",
    description:
      "This embroidered t-shirt features refined embroidery on a relaxed crew neck silhouette with short sleeves.",
    image:
      "https://admin.aylee.store/uploads/category/2026/07/5JJrwpiJlpnR7jvIvDBU_06_a5df6eb40072e03c2f5eab7900d4112f_image.png",
    gender: "male",
    parentId: null,
    children: [],
  },
];

const description =
  "Made from soft and breathable cotton fabric. Designed for comfortable everyday wear. Features a simple and versatile style. Easy to pair with jeans, trousers, or shorts. Suitable for casual outings and daily use.";
const category = { id: "2", slug: "t-shirts", name: "T-Shirts" } as const;

function product(
  id: string,
  slug: string,
  stock: number,
  sizes: string[],
  image: string,
  createdAt: string,
): Product {
  return {
    id,
    slug,
    name: "Relaxed T Shirt",
    description,
    price: 2025,
    compareAtPrice: 2250,
    discountPercent: 10,
    currency: "PKR",
    images: [
      {
        id: `${id}-primary`,
        url: image,
        thumbnailUrl: image.replace(/\.jpg$/, "_thumbnail.jpg"),
        alt: "Relaxed T Shirt",
      },
    ],
    stock,
    sizes,
    colors: [],
    category,
    sku: null,
    brand: "Aylee",
    isFeatured: true,
    isAvailable: stock > 0,
    createdAt,
    tags: ["relaxed", "t-shirt", "t-shirts"],
  };
}

export const fallbackProducts: Product[] = [
  product(
    "14",
    "relaxed-t-shirt",
    14,
    ["S", "M", "L", "XL"],
    "https://admin.aylee.store/uploads/products/2026/07/nYaISb1YBvc6FIFj9JN9_31_f04ea5503a61412f9c0962feb2abe6cc_0.jpg",
    "2026-07-31 18:58:33",
  ),
  product(
    "15",
    "relaxed-t-shirt-2607311158-981",
    14,
    ["S", "M", "L", "XL"],
    "https://admin.aylee.store/uploads/products/2026/07/q2NwT5B9rwj3Td2wzfyZ_31_68af01e4f95adc5da9ca76c3aa8cb588_0.jpg",
    "2026-07-31 19:11:59",
  ),
  product(
    "16",
    "relaxed-t-shirt-2607311402-909",
    16,
    ["S", "M", "L", "XL"],
    "https://admin.aylee.store/uploads/products/2026/07/wTTlCNANRSiWRZ7CK75Q_31_e347a49a5438a7a78c1cd952abdf4faf_0.jpg",
    "2026-07-31 19:14:02",
  ),
  product(
    "17",
    "relaxed-t-shirt-2607311914-669",
    16,
    ["S", "M"],
    "https://admin.aylee.store/uploads/products/2026/07/wD4lJVsS6pEnoSXyyKXz_31_3cd9fe341b677e5bfb3cd2fccf2d0881_0.jpg",
    "2026-07-31 19:19:14",
  ),
  product(
    "18",
    "relaxed-t-shirt-2607312322-802",
    16,
    ["S", "M", "L", "XL"],
    "https://admin.aylee.store/uploads/products/2026/07/qKVhgGoCqwHjCSrk6Gp3_31_962e209d46ee77ff94376cce09a42345_0.jpg",
    "2026-07-31 19:23:23",
  ),
];

export const fallbackBanners: Banner[] = [
  {
    id: "3",
    title: "Henly",
    description: null,
    image:
      "https://admin.aylee.store/storage/photos/1/product_06_website_square_1600.jpg",
  },
  {
    id: "2",
    title: "Polo",
    description: null,
    image:
      "https://admin.aylee.store/storage/photos/1/product_05_website_square_1600.jpg",
  },
];
