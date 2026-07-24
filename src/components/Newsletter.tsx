import { useState } from "react";
import { motion } from "framer-motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <section className="bg-[var(--panel)] border-y border-[var(--line)] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--gold-deep)] uppercase">
            Join the Club
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl mt-4 mb-6 text-[var(--ink)]">
            Subscribe to our Newsletter
          </h2>
          <p className="text-sm text-[var(--muted)] max-w-lg mx-auto mb-10 leading-relaxed">
            Sign up to receive early access to new collections, exclusive brand updates, and private sales invitations.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl border border-[var(--gold)] bg-[var(--champagne)] inline-block"
            >
              <p className="text-sm font-semibold text-[var(--gold-deep)] tracking-wide">
                Thank you! You have been subscribed to our mailing list.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch max-w-lg mx-auto border-b border-[var(--ink)] pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="flex-1 bg-transparent border-0 outline-none px-2 py-3 text-xs tracking-wider uppercase text-[var(--ink)] placeholder-black/30"
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 px-6 py-3 text-xs font-bold tracking-[0.2em] text-[var(--ink)] hover:text-[var(--gold-deep)] transition duration-300"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
