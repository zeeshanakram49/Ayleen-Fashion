import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Order confirmation",
  description: "Your Aylee order confirmation.",
  path: "/order-confirmation",
  noIndex: true,
});

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <div className="container-site section-pad flex min-h-[60vh] items-center justify-center">
      <div className="max-w-2xl text-center">
        <CheckCircle2
          size={54}
          strokeWidth={1.25}
          className="mx-auto text-[#28633b]"
        />
        <p className="eyebrow mt-7">Order received</p>
        <h1 className="page-title mt-4">Thank you.</h1>
        <p className="mt-6 text-[#6c6961]">
          Your order reference is{" "}
          <strong className="text-[#171613]">
            {decodeURIComponent(orderId)}
          </strong>
          . Confirmation and fulfilment details are provided by Aylee&apos;s
          commerce backend.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="button-primary">
            View orders
          </Link>
          <Link href="/shop" className="button-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
