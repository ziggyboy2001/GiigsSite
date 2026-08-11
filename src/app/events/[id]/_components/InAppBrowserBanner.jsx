"use client";

import { useEffect, useState } from "react";

import { detectInAppBrowser, detectPlatform } from "../../../../lib/device";
import { track } from "../../../../lib/analytics";

/**
 * Shown only when the page is being viewed inside an in-app browser (Instagram,
 * Facebook, TikTok, etc.). Those embedded webviews block hand-off to the App
 * Store / Play Store, so the "Open in Giigs" button and store links silently do
 * nothing. This banner nudges the user into their real browser:
 *   - Android → we can force-escape to Chrome via an intent:// URL.
 *   - iOS     → best-effort x-safari- escape, plus written instructions.
 *   - Always  → a "Copy link" fallback that works everywhere.
 * Renders nothing for normal browsers, so the default flow is untouched.
 */
export default function InAppBrowserBanner() {
  const [app, setApp] = useState(null);
  const [platform, setPlatform] = useState("desktop");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const detected = detectInAppBrowser();
    setApp(detected);
    setPlatform(detectPlatform());
    if (detected) track("in_app_browser_detected", { app: detected });
  }, []);

  if (!app) return null;

  const openInBrowser = () => {
    track("in_app_browser_escape_attempt", { app, platform });
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    if (platform === "android") {
      // Escape the webview straight into Chrome.
      const noScheme = url.replace(/^https?:\/\//, "");
      window.location.href = `intent://${noScheme}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }
    // iOS: x-safari- prefix pops the page open in real Safari from many
    // in-app webviews. If it's ignored, the written steps below still apply.
    window.location.href = `x-safari-${url}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      track("in_app_browser_link_copied", { app });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const isNamed = app !== "in-app";
  const heading = isNamed
    ? `You’re in ${app}’s in-app browser`
    : `You’re in an in-app browser`;
  const subject = isNamed ? app : "This browser";
  const steps =
    platform === "ios"
      ? `Tap the ••• (or “aA”) button in the top corner, then “Open in Safari”.`
      : `Tap the ⋮ menu in the top corner, then “Open in browser”.`;

  return (
    <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-left">
      <p className="text-sm font-semibold text-amber-200">{heading}</p>
      <p className="mt-1 text-sm text-amber-100/80">
        {subject} blocks opening the App Store here. Open this page in your real
        browser to get Giigs. {steps}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openInBrowser}
          className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          Open in browser
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center justify-center rounded-lg border border-amber-300/50 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/10"
        >
          {copied ? "Link copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
