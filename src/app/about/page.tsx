import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "Learn about the Aylee online and in-store shopping experience.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <div>
      <div className="container-site py-8 md:py-12">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
      </div>
      <section className="bg-[#e9e4db]">
        <div className="container-site grid min-h-[55vh] items-center py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">About Aylee</p>
            <h1 className="display-title mt-5">Online and in stores.</h1>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-8 text-[#57544d]">
              Aylee currently presents a focused clothing catalog through its
              online store and published retail locations in Pakistan.
            </p>
            <p className="mt-5 text-[#6c6961]">
              A longer verified brand history was not available from the source
              website, so this page intentionally avoids inventing founding
              dates, people, or claims.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/shop" className="button-primary">
                Shop Aylee
              </Link>
              <Link href="/stores" className="button-secondary">
                Find a store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
