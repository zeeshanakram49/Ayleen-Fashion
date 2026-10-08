import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={siteConfig.contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Aylee on WhatsApp"
      className="fixed top-1/2 right-0 z-[75] flex min-h-12 w-12 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-l-xl bg-[#25d366] py-3 text-white shadow-[0_10px_30px_rgb(18_92_49/0.35)] transition-transform duration-300 hover:-translate-x-1 focus-visible:outline-white md:min-h-32 md:w-14"
    >
      <span
        className="whatsapp-button-icon relative grid size-8 place-items-center"
        aria-hidden="true"
      >
        <MessageCircle size={30} strokeWidth={2} />
        <Phone
          size={14}
          strokeWidth={2.4}
          className="absolute rotate-[-18deg]"
        />
      </span>
      <span className="hidden rotate-180 text-[0.65rem] font-bold tracking-[0.12em] uppercase [writing-mode:vertical-rl] md:block">
        WhatsApp
      </span>
    </a>
  );
}
