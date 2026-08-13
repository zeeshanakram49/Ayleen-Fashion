import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { StoreProvider } from "@/components/providers/store-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SiteMotionConfig } from "@/components/motion/motion-config";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/commerce/collections";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Aylee | Official Online Store",
    template: "%s | Aylee",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "Aylee | Official Online Store",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: "/og-aylee.jpg",
        secureUrl: "/og-aylee.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Aylee official online store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aylee | Official Online Store",
    description: siteConfig.description,
    images: ["/og-aylee.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffefb",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();
  const menuCategories = categories.flatMap((category) => [
    { id: category.id, slug: category.slug, name: category.name },
    ...category.children.map((child) => ({
      id: child.id,
      slug: child.slug,
      name: child.name,
    })),
  ]);

  return (
    <html lang="en-PK" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <SiteMotionConfig>
            <MotionProvider />
            <Header categories={menuCategories} />
            <main id="main-content">{children}</main>
            <Footer />
            <CartDrawer />
          </SiteMotionConfig>
        </StoreProvider>
      </body>
    </html>
  );
}
