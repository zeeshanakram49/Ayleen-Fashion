const COLOR_NAME_FALLBACKS: Record<string, string> = {
  beige: "#d8c3a5",
  black: "#000000",
  blue: "#2563eb",
  brown: "#8b5e3c",
  burgundy: "#800020",
  charcoal: "#36454f",
  cream: "#fffdd0",
  gray: "#808080",
  green: "#16803c",
  grey: "#808080",
  khaki: "#c3b091",
  maroon: "#800000",
  navy: "#000080",
  olive: "#6b6b24",
  orange: "#ea6a2a",
  pink: "#dc6f91",
  purple: "#7e4b9e",
  red: "#c93636",
  "smoke gray": "#6b7075",
  "smoke grey": "#6b7075",
  teal: "#147d78",
  white: "#ffffff",
  yellow: "#e2b928",
};

function validHexColor(value: string): boolean {
  return /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(value);
}

export function isLightColorCode(value: string | null): boolean {
  if (!value || !validHexColor(value)) return false;
  const raw = value.slice(1);
  const hex = raw.length === 3 ? raw.replace(/(.)/g, "$1$1") : raw.slice(0, 6);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 200;
}

export function resolveProductColorCode(
  nameValue: string,
  apiCodeValue: string,
): string | null {
  const name = nameValue.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  const apiCode = apiCodeValue.trim();
  const fallback = COLOR_NAME_FALLBACKS[name];

  if (!validHexColor(apiCode)) return fallback || null;

  const isBlackPlaceholder = ["#000", "#000000", "#000000ff"].includes(
    apiCode.toLocaleLowerCase(),
  );
  if (isBlackPlaceholder && name !== "black" && fallback) return fallback;

  return apiCode;
}
