import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[65vh] items-center justify-center py-20 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display-title mt-5">This page has moved on.</h1>
        <p className="mx-auto mt-6 max-w-lg text-[#6c6961]">
          The item may no longer be available, or the address may be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="button-primary">
            Explore the shop
          </Link>
          <Link href="/" className="button-secondary">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
