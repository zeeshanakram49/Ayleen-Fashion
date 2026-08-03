import type { Metadata } from "next";
import { PolicyPage } from "@/components/common/policy-page";
import { policies } from "@/config/content";
import { createMetadata } from "@/lib/seo/metadata";

const policy = policies["terms-and-conditions"]!;
export const metadata: Metadata = createMetadata({
  title: policy.title,
  description: policy.description,
  path: "/terms-and-conditions",
  noIndex: true,
});
export default function Page() {
  return <PolicyPage policy={policy} />;
}
