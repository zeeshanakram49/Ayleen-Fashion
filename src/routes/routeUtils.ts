export function getHashUrl(path: string): string {
  return `#${path}`;
}

export function navigateToHash(path: string) {
  if (typeof window !== "undefined") {
    window.location.hash = path.startsWith("/") ? path : `/${path}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function readHashSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();

  const queryIndex = window.location.hash.indexOf("?");
  if (queryIndex === -1) return new URLSearchParams();

  return new URLSearchParams(window.location.hash.slice(queryIndex + 1));
}
