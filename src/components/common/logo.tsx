import Link from "next/link";

export function Logo({
  light = false,
  prominent = false,
}: {
  light?: boolean;
  prominent?: boolean;
}) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Aylee home">
      <span
        className={`serif leading-none tracking-[-0.08em] ${prominent ? "text-[2.25rem] md:text-[2.5rem]" : "text-[2rem]"} ${light ? "text-white" : "text-[#171613]"}`}
      >
        AYLEE
      </span>
    </Link>
  );
}
