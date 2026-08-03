import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import type { PolicyContent } from "@/config/content";
import { siteConfig } from "@/config/site";

export function PolicyPage({ policy }: { policy: PolicyContent }) {
  return (
    <div className="container-site section-pad !pt-8 md:!pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: policy.title }]}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="eyebrow">Customer care</p>
        <h1 className="page-title mt-4">{policy.title}</h1>
        <p className="mt-5 text-[#6c6961]">{policy.description}</p>
        {policy.status === "pending-confirmation" ? (
          <div className="mt-8 flex gap-3 border border-[#c7a352] bg-[#fff9e9] p-4 text-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p>
              <strong>Content pending confirmation.</strong> This page
              distinguishes verified source statements from details that were
              not publicly available.
            </p>
          </div>
        ) : null}
        <div className="mt-12 space-y-10">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="serif text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[#57544d]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 border-t border-[#dedbd2] pt-8">
          <h2 className="serif text-3xl">Need a confirmed answer?</h2>
          <p className="mt-3 text-[#6c6961]">
            Email{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>{" "}
            or{" "}
            <a
              href={siteConfig.contact.whatsappHref}
              className="underline underline-offset-4"
            >
              contact Aylee on WhatsApp
            </a>
            .
          </p>
          <Link href="/contact" className="button-secondary mt-6">
            Contact customer service
          </Link>
        </div>
      </div>
    </div>
  );
}
