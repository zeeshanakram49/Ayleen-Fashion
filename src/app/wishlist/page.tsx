import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WishlistView } from "@/components/product/wishlist-view";
import { getProducts } from "@/lib/commerce/products";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Wishlist",
  description: "View products saved to your Aylee wishlist.",
  path: "/wishlist",
  noIndex: true,
});

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <h1 className="page-title mt-10 mb-12">Wishlist</h1>
      <WishlistView products={products} />
    </div>
  );
}
