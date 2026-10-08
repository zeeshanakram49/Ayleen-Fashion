"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { MessageCircleQuestion, Send, X } from "lucide-react";
import { policies } from "@/config/content";
import { siteConfig } from "@/config/site";

type Topic = {
  title: string;
  keywords: string[];
  answer: string;
  answerRomanUrdu: string;
  href: string;
  linkLabel: string;
};

const topics: Topic[] = [
  {
    title: "Delivery & shipping",
    keywords: [
      "delivery",
      "shipping",
      "ship",
      "courier",
      "postage",
      "deliver",
      "free",
      "charges",
      "kab",
      "kitna",
      "bhejna",
      "kabtak",
      "deliveri",
    ],
    answer: policies["shipping-policy"]!.sections[0]!.paragraphs.join(" "),
    answerRomanUrdu:
      "Rs. 5,000 ya us se zyada ke order par delivery free hai. Chhote order ka delivery charge aur apne shehar ka expected delivery time confirm karne ke liye Aylee ko WhatsApp karein.",
    href: "/shipping-policy",
    linkLabel: "Shipping policy",
  },
  {
    title: "Exchange & returns",
    keywords: [
      "exchange",
      "return",
      "refund",
      "replace",
      "wapas",
      "badal",
      "tabdeel",
      "wapsi",
    ],
    answer: policies["exchange-policy"]!.sections[0]!.paragraphs.join(" "),
    answerRomanUrdu:
      "Exchange ke liye parcel bhejne se pehle apna order number aur item ki details WhatsApp par bhejein. Item unused aur original tags ke saath rakhein. Exchange window, eligibility aur courier charges team se confirm karein.",
    href: "/exchange-policy",
    linkLabel: "Exchange policy",
  },
  {
    title: "Size help",
    keywords: [
      "size",
      "sizing",
      "fit",
      "measurement",
      "chart",
      "small",
      "medium",
      "large",
      "suit",
      "naap",
    ],
    answer:
      "You can check available sizes on each product page and view product size charts in the size guide. For fit advice, contact Aylee before ordering.",
    answerRomanUrdu:
      "Har product page par available sizes dekhein. Size chart ke liye size guide kholein. Fit ka mashwara chahiye to order se pehle Aylee se rabta karein.",
    href: "/size-guide",
    linkLabel: "Size guide",
  },
  {
    title: "Products & prices",
    keywords: [
      "product",
      "products",
      "price",
      "prices",
      "cost",
      "stock",
      "available",
      "kapray",
      "clothes",
      "dress",
      "shirt",
      "collection",
      "shop",
      "sale",
      "kapre",
      "kapra",
      "daam",
      "rate",
    ],
    answer:
      "Browse the shop for current products, prices, sizes and availability. Each product page has its own details.",
    answerRomanUrdu:
      "Maujooda products, prices, sizes aur availability shop page par dekhein. Har product ki apni details us ke page par hain.",
    href: "/shop",
    linkLabel: "Browse products",
  },
  {
    title: "Orders & checkout",
    keywords: [
      "order",
      "checkout",
      "payment",
      "pay",
      "cart",
      "track",
      "status",
      "cod",
      "cash",
    ],
    answer:
      "You can place an order through checkout. For help with an existing order, contact Aylee with your order number. Please don't share payment details in this chat.",
    answerRomanUrdu:
      "Order checkout se place kar sakte hain. Purane order ki madad ke liye order number ke saath Aylee se rabta karein. Payment details is chat mein share na karein.",
    href: "/contact",
    linkLabel: "Contact Aylee",
  },
  {
    title: "Contact & hours",
    keywords: [
      "contact",
      "whatsapp",
      "phone",
      "email",
      "hours",
      "timing",
      "help",
      "support",
      "rabta",
      "number",
    ],
    answer: `Aylee support is available ${siteConfig.contact.hours}. You can email ${siteConfig.contact.email} or message ${siteConfig.contact.whatsappDisplay} on WhatsApp.`,
    answerRomanUrdu: `Aylee support ${siteConfig.contact.hours} available hai. Email ${siteConfig.contact.email} par ya WhatsApp ${siteConfig.contact.whatsappDisplay} par message karein.`,
    href: "/contact",
    linkLabel: "Contact details",
  },
  {
    title: "Store locations",
    keywords: [
      "store",
      "location",
      "address",
      "visit",
      "shop location",
      "dukan",
    ],
    answer:
      "Please contact Aylee before planning a store visit. Our team can confirm current locations and opening hours.",
    answerRomanUrdu:
      "Store visit plan karne se pehle Aylee se rabta karein. Team current location aur opening hours confirm kar degi.",
    href: "/stores",
    linkLabel: "Store information",
  },
  {
    title: "Hello",
    keywords: ["hi", "hello", "hey", "salam", "assalam", "aoa"],
    answer:
      "Hello! I can help with products, prices, delivery, sizes, exchanges and contact details. What would you like to know?",
    answerRomanUrdu:
      "Assalam-o-alaikum! Main products, prices, delivery, sizes, exchange aur contact details mein madad kar sakta hoon. Aap kya poochna chahte hain?",
    href: "/shop",
    linkLabel: "Explore Aylee",
  },
];

type Message = { text: string; from: "visitor" | "helper"; topic?: Topic };

const romanUrduWords = new Set([
  "aap",
  "ap",
  "batao",
  "btao",
  "chahiye",
  "hai",
  "hain",
  "kab",
  "kaise",
  "kitna",
  "kitni",
  "kya",
  "mera",
  "meri",
  "mere",
  "mujhe",
  "salam",
  "assalam",
  "aoa",
  "wapas",
  "karo",
  "karna",
  "hoga",
  "hogi",
]);

function isRomanUrdu(question: string): boolean {
  return (question.toLowerCase().match(/[a-z0-9]+/g) ?? []).some((word) =>
    romanUrduWords.has(word),
  );
}

function findTopic(question: string): Topic | undefined {
  const words: string[] = question.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const best = topics
    .map((topic) => ({
      topic,
      score: topic.keywords.reduce(
        (count, keyword) => count + (words.includes(keyword) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score)[0];
  return best?.score ? best.topic : undefined;
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  function ask(question: string) {
    const text = question.trim();
    if (!text) return;
    const topic = findTopic(text);
    const romanUrdu = isRomanUrdu(text);
    setMessages((current) => [
      ...current,
      { from: "visitor", text },
      {
        from: "helper",
        text: topic
          ? romanUrdu
            ? topic.answerRomanUrdu
            : topic.answer
          : romanUrdu
            ? "Is sawal ka pakka jawab website par nahi mila. Aap delivery, size, products, exchange ya order ke bare mein pooch sakte hain. Mazeed madad ke liye WhatsApp par Aylee team se baat karein."
            : "I couldn't find a clear answer on the website. You can ask about delivery, sizes, products, exchanges or orders. For more help, please contact the Aylee team on WhatsApp.",
        topic,
      },
    ]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <>
      {open && (
        <section
          id="help-chat-panel"
          aria-label="Aylee help chat"
          className="fixed bottom-40 left-4 z-[76] flex h-[min(65dvh,560px)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#dedbd2] bg-[#fffefb] shadow-[0_20px_60px_rgb(23_22_19/0.22)] md:bottom-24 md:left-7"
        >
          <div className="flex items-center justify-between bg-[#6f2d24] px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Aylee help</h2>
              <p className="text-xs text-white/80">
                Quick answers from our website
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help chat"
              className="rounded-full p-2 hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>
          <div
            ref={messagesRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-sm"
            aria-live="polite"
          >
            <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-[#f1ede5] p-3">
              Hi! What can I help you find?
            </p>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.from === "visitor"
                    ? "ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-[#6f2d24] p-3 text-white"
                    : "max-w-[90%] rounded-2xl rounded-tl-sm bg-[#f1ede5] p-3"
                }
              >
                <p>{message.text}</p>
                {message.topic && (
                  <Link
                    href={message.topic.href}
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-block font-semibold underline underline-offset-2"
                  >
                    {message.topic.linkLabel}
                  </Link>
                )}
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.slice(0, 4).map((topic) => (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => ask(topic.title)}
                    className="rounded-full border border-[#dedbd2] px-3 py-1.5 text-xs hover:bg-[#f1ede5]"
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            )}
            {messages.at(-1)?.from === "helper" && (
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-[#6f2d24] underline underline-offset-2"
              >
                Need more help? WhatsApp us
              </a>
            )}
          </div>
          <form
            onSubmit={submit}
            className="flex gap-2 border-t border-[#dedbd2] p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={200}
              placeholder="Ask a question..."
              aria-label="Your question"
              className="min-w-0 flex-1 rounded-full border border-[#dedbd2] px-3 py-2 text-sm outline-none focus:border-[#6f2d24]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send question"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#6f2d24] text-white disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close Aylee help chat" : "Open Aylee help chat"}
        aria-expanded={open}
        aria-controls="help-chat-panel"
        className="fixed bottom-24 left-4 z-[76] flex h-12 items-center gap-2 rounded-full bg-[#6f2d24] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgb(23_22_19/0.25)] transition-transform hover:-translate-y-1 md:bottom-7 md:left-7"
      >
        <MessageCircleQuestion size={20} aria-hidden="true" />
        Help
      </button>
    </>
  );
}
