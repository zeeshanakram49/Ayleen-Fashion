import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  inverted?: boolean;
}) {
  return (
    <div
      data-reveal
      className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between"
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className={`eyebrow mb-3 ${inverted ? "!text-white/65" : ""}`}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className="serif text-4xl leading-none tracking-[-0.04em] md:text-6xl">
          {title}
        </h2>
        {description ? (
          <p
            className={`mt-4 max-w-2xl ${inverted ? "text-white/70" : "text-[#6c6961]"}`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {link ? (
        <Link
          href={link.href}
          className="premium-link text-xs font-bold tracking-wider uppercase"
        >
          {link.label}
        </Link>
      ) : null}
    </div>
  );
}
