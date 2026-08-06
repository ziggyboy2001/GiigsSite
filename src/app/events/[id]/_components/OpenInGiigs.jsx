"use client";

import { useEffect, useState } from "react";

import StoreBadges, {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../../../components/StoreBadges";
import { detectPlatform } from "../../../../lib/device";
import { track } from "../../../../lib/analytics";

/**
 * Device-detected "Open in Giigs" CTA.
 *  - iOS / Android → a single primary button that routes to the right store.
 *  - Desktop       → both store badges (tracked on click).
 *
 * Once Universal/App Links ship (Phase 5), tapping the page URL opens the app
 * directly for installed users before this even renders — so this CTA primarily
 * serves not-installed visitors, i.e. the store redirect.
 */
export default function OpenInGiigs({ showId }) {
  const [platform, setPlatform] = useState("desktop");
  useEffect(() => setPlatform(detectPlatform()), []);

  // Try the app first, fall back to the store only if it doesn't take over.
  //
  // We CAN'T just navigate to this page's URL: iOS/Android suppress the
  // Universal/App Link when it points at the domain you're already browsing.
  // Instead we fire the app's custom scheme (giigs://events/:id — registered
  // via app.json "scheme": "giigs" → RootApp maps it to the Playground detail
  // sheet). If the app opens, the browser tab is backgrounded (visibility
  // hidden / pagehide); if we're still visible after a short beat, the app
  // isn't installed → send them to the store.
  const openApp = (store) => {
    const storeUrl = store === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    track("open_in_giigs_clicked", { show_id: showId, platform });

    let appOpened = false;
    const markOpened = () => {
      appOpened = true;
    };
    document.addEventListener("visibilitychange", markOpened);
    window.addEventListener("pagehide", markOpened);
    window.addEventListener("blur", markOpened);

    // Kick off the app open (user-gesture context keeps the scheme nav allowed).
    window.location.href = `giigs://events/${encodeURIComponent(showId)}`;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", markOpened);
      window.removeEventListener("pagehide", markOpened);
      window.removeEventListener("blur", markOpened);
      if (appOpened || document.hidden) return; // app took over
      track("store_redirected", { show_id: showId, store });
      window.location.href = storeUrl;
    }, 1500);
  };

  if (platform === "ios" || platform === "android") {
    return (
      <button
        type="button"
        onClick={() => openApp(platform)}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#8338ec] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0] sm:w-auto"
      >
        Open in Giigs
      </button>
    );
  }

  // Desktop: show both badges. Infer the store from the clicked anchor so we can
  // still record the redirect without forking StoreBadges.
  const onBadgeClick = (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const store = href.includes("apps.apple.com")
      ? "ios"
      : href.includes("play.google.com")
      ? "android"
      : "unknown";
    track("open_in_giigs_clicked", { show_id: showId, platform: "desktop" });
    track("store_redirected", { show_id: showId, store });
  };

  return (
    <div onClick={onBadgeClick} className="flex justify-center">
      <StoreBadges size={160} />
    </div>
  );
}
