import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Aylee home">
      <span
        className={`serif text-[2rem] leading-none tracking-[-0.08em] ${light ? "text-white" : "text-[#171613]"}`}
      >
        AYLEE
      </span>
    </Link>
  );
}
