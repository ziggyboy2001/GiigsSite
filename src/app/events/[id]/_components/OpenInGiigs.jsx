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

  const goToStore = (store) => {
    const url = store === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    track("open_in_giigs_clicked", { show_id: showId, platform });
    track("store_redirected", { show_id: showId, store });
    window.location.href = url;
  };

  if (platform === "ios" || platform === "android") {
    return (
      <button
        type="button"
        onClick={() => goToStore(platform)}
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
