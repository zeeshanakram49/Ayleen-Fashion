const GUEST_TOKEN_KEY = "ayleen_guest_token";

function generateGuestToken(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(24);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateGuestToken(): string {
  if (typeof window === "undefined") return generateGuestToken();

  const existingToken = window.localStorage.getItem(GUEST_TOKEN_KEY)?.trim();
  if (existingToken) return existingToken;

  const token = generateGuestToken();
  window.localStorage.setItem(GUEST_TOKEN_KEY, token);
  return token;
}

