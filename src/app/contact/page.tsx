import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Contact Aylee customer service by email or WhatsApp.",
  path: "/contact",
});
export default function ContactPage() {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <header className="mt-10 max-w-3xl">
        <p className="eyebrow">Customer care</p>
        <h1 className="page-title mt-4">How can we help?</h1>
        <p className="mt-5 text-[#6c6961]">
          Reach the Aylee team during published support hours.
        </p>
      </header>
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-5">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex gap-4 border border-[#dedbd2] p-6 hover:bg-[#f7f5f0]"
          >
            <Mail size={21} />
            <span>
              <strong className="block">Email</strong>
              <span className="mt-1 block text-sm text-[#6c6961]">
                {siteConfig.contact.email}
              </span>
            </span>
          </a>
          <a
            href={siteConfig.contact.whatsappHref}
            className="flex gap-4 border border-[#dedbd2] p-6 hover:bg-[#f7f5f0]"
          >
            <MessageCircle size={21} />
            <span>
              <strong className="block">WhatsApp</strong>
              <span className="mt-1 block text-sm text-[#6c6961]">
                {siteConfig.contact.whatsappDisplay}
              </span>
            </span>
          </a>
          <p className="text-sm text-[#6c6961]">{siteConfig.contact.hours}</p>
        </aside>
        <div>
          <h2 className="serif mb-6 text-3xl">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
