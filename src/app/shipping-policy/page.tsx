import type { Metadata } from "next";
import { PolicyPage } from "@/components/common/policy-page";
import { policies } from "@/config/content";
import { createMetadata } from "@/lib/seo/metadata";

const policy = policies["shipping-policy"]!;
export const metadata: Metadata = createMetadata({
  title: policy.title,
  description: policy.description,
  path: "/shipping-policy",
});
export default function Page() {
  return <PolicyPage policy={policy} />;
}
