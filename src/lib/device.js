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

/**
 * Detect embedded "in-app" browsers (Instagram, Facebook, TikTok, etc.).
 * These webviews frequently block hand-off to the App Store / Play Store, so
 * store and app-open links silently do nothing. Returns a friendly app name
 * (e.g. "Instagram") when inside one, otherwise null.
 */
export function detectInAppBrowser() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || navigator.vendor || "";

  // Named apps first, so we can show a friendly "Instagram/TikTok" label.
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "Facebook";
  if (/Messenger/i.test(ua)) return "Messenger";
  if (/TikTok|BytedanceWebview|musical_ly/i.test(ua)) return "TikTok";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/\bLine\//i.test(ua)) return "Line";
  if (/Pinterest/i.test(ua)) return "Pinterest";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  if (/Twitter|TwitterAndroid/i.test(ua)) return "X";

  // Generic webview heuristics for unnamed in-app browsers. These share the
  // same App Store / Play Store hand-off restrictions, so treat them the same.
  const platform = detectPlatform();
  // Android WebViews carry the "; wv)" token.
  if (platform === "android" && /;\s*wv\)/i.test(ua)) return "in-app";
  // iOS WKWebViews (used by in-app browsers) omit the "Safari" token that real
  // Safari and Chrome/Firefox-for-iOS always include.
  if (
    platform === "ios" &&
    !/Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua)
  ) {
    return "in-app";
  }

  return null;
}

export default detectPlatform;
