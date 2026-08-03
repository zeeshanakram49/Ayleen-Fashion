import Link from "next/link";

export function EmptyState({
  title,
  message,
  action = { href: "/shop", label: "Explore the shop" },
}: {
  title: string;
  message: string;
  action?: { href: string; label: string } | null;
}) {
  return (
    <div className="border border-[#dedbd2] bg-[#f7f5f0] px-6 py-16 text-center">
      <h2 className="serif text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-[#6c6961]">{message}</p>
      {action ? (
        <Link href={action.href} className="button-primary mt-7">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
