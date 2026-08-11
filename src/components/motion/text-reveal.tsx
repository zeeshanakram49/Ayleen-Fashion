"use client";

import { motion } from "framer-motion";

export function SplitText({
  text,
  className,
  delay = 0,
  animateKey,
}: {
  text: string;
  className?: string;
  delay?: number;
  animateKey?: string | number;
}) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${animateKey ?? "static"}-${index}`}
          className="inline-block overflow-hidden align-top"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: delay + index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
