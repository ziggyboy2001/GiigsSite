/**
 * Lightweight client-side device detection for the "Open in Giigs" CTA.
 * UA-sniffing is imperfect but sufficient to route a tap to the right store.
 * Returns "ios" | "android" | "desktop".
 */
export function detectPlatform() {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || navigator.vendor || "";

  // iPadOS 13+ reports as Mac; disambiguate via touch points.
  const isIPadOS =
    /Macintosh/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1;

  if (/iPad|iPhone|iPod/.test(ua) || isIPadOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

export default detectPlatform;
