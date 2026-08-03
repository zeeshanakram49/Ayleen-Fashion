export type ProductImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  gender: string | null;
  parentId: string | null;
  children: Category[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number | null;
  currency: "PKR";
  images: ProductImage[];
  stock: number;
  sizes: string[];
  colors: string[];
  category: Pick<Category, "id" | "slug" | "name"> | null;
  sku: string | null;
  brand: string;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string | null;
  tags: string[];
};

export type Banner = {
  id: string;
  title: string;
  description: string | null;
  image: string;
};

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

export type ProductQuery = {
  query?: string;
  category?: string;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";
  availability?: "in-stock" | "out-of-stock";
  sale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  limit?: number;
};
