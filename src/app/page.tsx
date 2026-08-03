import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Headphones,
  RefreshCcw,
  Truck,
} from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/common/section-heading";
import { JsonLd } from "@/components/common/json-ld";
import { getBanners, getProducts } from "@/lib/commerce/products";
import { getCategories } from "@/lib/commerce/collections";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export const revalidate = 300;

const benefits = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    detail: "Free delivery on qualifying orders above Rs. 2,500.",
  },
  {
    icon: RefreshCcw,
    title: "Exchange support",
    detail: "Published support for unused articles with original tags.",
  },
  {
    icon: CircleCheck,
    title: "Secure checkout",
    detail:
      "Hosted card and mobile-wallet flows; raw card data is never collected here.",
  },
  {
    icon: Headphones,
    title: "Human support",
    detail: siteConfig.contact.hours,
  },
];

export default async function HomePage() {
  const [products, categories, banners] = await Promise.all([
    getProducts({ sort: "featured", limit: 8 }),
    getCategories(),
    getBanners(),
  ]);
  const hero = banners[0];
  const saleProducts = products
    .filter((product) => Boolean(product.compareAtPrice))
    .slice(0, 4);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/aylee-store-logo.jpg`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.whatsappDisplay,
      contactType: "customer support",
      areaServed: "PK",
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <section className="relative min-h-[72svh] overflow-hidden bg-[#d9d5cc] md:min-h-[82svh]">
        {hero ? (
          <Image
            src={hero.image}
            alt="Aylee seasonal collection"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#c9c1b4,#eeeae2_55%,#b5aa99)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="container-site relative flex min-h-[72svh] items-end py-12 text-white md:min-h-[82svh] md:items-center md:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow !text-white/75">The latest Aylee edit</p>
            <h1 className="display-title mt-5 max-w-3xl">
              Everyday style, considered.
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
              Explore the current collection, sourced directly from Aylee&apos;s
              live catalog.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="button-primary !border-white !bg-white !text-[#171613] hover:!bg-[#f2eee7]"
              >
                Shop the collection <ArrowRight size={16} />
              </Link>
              <Link
                href="/collections"
                className="button-secondary !border-white !text-white hover:!bg-white hover:!text-[#171613]"
              >
                Browse categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad container-site">
        <SectionHeading
          eyebrow="Find your edit"
          title="Shop by category"
          description="Browse the categories currently available from Aylee."
        />
        {categories.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/3] overflow-hidden bg-[#efede7] md:aspect-[5/4]"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-9">
                  <p className="text-xs tracking-[0.18em] uppercase">
                    Category {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="serif mt-2 text-4xl md:text-5xl">
                    {category.name}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                    Explore <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="border border-[#dedbd2] bg-[#f7f5f0] p-8 text-[#6c6961]">
            Categories are temporarily unavailable. The catalog will return
            automatically when the commerce service is reachable.
          </p>
        )}
      </section>

      <section className="section-pad bg-[#f7f5f0]">
        <div className="container-site">
          <SectionHeading
            eyebrow="Current collection"
            title="New in"
            description="Recently added pieces from the live Aylee catalog."
            link={{ href: "/new-arrivals", label: "View new arrivals" }}
          />
          {products.length ? (
            <ProductGrid products={products.slice(0, 4)} />
          ) : (
            <p className="py-12 text-center text-[#6c6961]">
              New arrivals are syncing. Please check back shortly.
            </p>
          )}
        </div>
      </section>

      <section className="section-pad container-site">
        <SectionHeading
          eyebrow="Aylee selection"
          title="Featured pieces"
          link={{ href: "/shop", label: "Shop all" }}
        />
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-12 text-center text-[#6c6961]">
            Products are temporarily unavailable.
          </p>
        )}
      </section>

      {saleProducts.length ? (
        <section className="section-pad bg-[#6f2d24] text-white">
          <div className="container-site">
            <SectionHeading
              eyebrow="Selected reductions"
              title="Sale essentials"
              description="Current markdowns supplied by the Aylee catalog."
              link={{ href: "/sale", label: "Shop sale" }}
            />
            <div className="rounded-sm bg-white p-4 text-[#171613] md:p-8">
              <ProductGrid products={saleProducts} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid bg-[#e9e4db] lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-16 lg:px-[8vw] lg:py-24">
          <div className="max-w-xl">
            <p className="eyebrow">Designed for real days</p>
            <h2 className="serif mt-4 text-5xl leading-[0.98] tracking-[-0.04em] md:text-7xl">
              Pieces that earn their place.
            </h2>
            <p className="mt-6 text-[#6c6961]">
              A focused catalog, clear availability, and a simple path from
              discovery to checkout.
            </p>
            <Link href="/about" className="button-secondary mt-8">
              Discover Aylee
            </Link>
          </div>
        </div>
        <div className="grid min-h-[400px] place-items-center bg-[#cbc2b5] p-12 text-center">
          <div>
            <p className="serif text-7xl tracking-[-0.06em] md:text-9xl">
              AYLEE
            </p>
            <p className="mt-3 text-xs tracking-[0.3em] uppercase">Pakistan</p>
          </div>
        </div>
      </section>

      <section className="section-pad container-site">
        <SectionHeading
          eyebrow="Customer feedback"
          title="Verified reviews, when available"
          description="The current backend does not publish verified review data. Reviews will appear here only when authentic purchase-linked feedback is available."
        />
        <div className="border border-[#dedbd2] bg-[#f7f5f0] p-8 md:p-12">
          <p className="serif max-w-3xl text-3xl leading-snug md:text-5xl">
            No fabricated ratings. No borrowed praise. Just verified customer
            voices when the data is ready.
          </p>
        </div>
      </section>

      <section className="border-y border-[#dedbd2] bg-white">
        <div className="container-site grid md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="border-b border-[#dedbd2] px-5 py-9 last:border-b-0 md:border-r lg:border-b-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"
            >
              <Icon size={24} strokeWidth={1.4} aria-hidden />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[#6c6961]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-[#171613] text-white">
        <div className="container-site grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow !text-white/55">Aylee list</p>
            <h2 className="serif mt-4 max-w-3xl text-5xl leading-none tracking-[-0.04em] md:text-7xl">
              First look at what&apos;s next.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-white/65">
              Receive new-drop alerts, selected offers, and store updates.
            </p>
            <div className="mt-6">
              <NewsletterForm id="home-email" dark />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad container-site">
        <SectionHeading
          eyebrow="Visit Aylee"
          title="Online and in stores"
          description="Published storefront locations across Lahore, Islamabad, and Karachi."
          link={{ href: "/stores", label: "View all stores" }}
        />
        <div className="grid gap-px bg-[#dedbd2] md:grid-cols-3">
          {siteConfig.stores.map((store) => (
            <article key={store.city} className="bg-white p-7 md:p-9">
              <h3 className="serif text-4xl">{store.city}</h3>
              <ul className="mt-5 space-y-2 text-sm text-[#6c6961]">
                {store.locations.map((location) => (
                  <li key={location}>{location}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
