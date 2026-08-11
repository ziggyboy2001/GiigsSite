"use client";

import { useEffect, useState } from "react";

import StoreBadges, {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../../../components/StoreBadges";
import { detectPlatform } from "../../../../lib/device";
import { track } from "../../../../lib/analytics";

/**
 * Install CTA.
 *
 * Store badges are the PRIMARY, always-rendered action — they're in the
 * server-rendered HTML and never depend on client JS, so every visitor sees
 * the same thing whether or not hydration runs (no more "badges for her,
 * button for me" race, and nothing to break inside flaky in-app browsers).
 *
 * On mobile we progressively add a small secondary "already have the app?"
 * deep link once the platform is detected. If JS never runs, the badges are
 * still there and fully functional.
 */
export default function OpenInGiigs({ showId }) {
  const [platform, setPlatform] = useState("desktop");
  useEffect(() => setPlatform(detectPlatform()), []);

  const isMobile = platform === "ios" || platform === "android";

  // Record which store an anchor tap sends the user to.
  const onBadgeClick = (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const store = href.includes("apps.apple.com")
      ? "ios"
      : href.includes("play.google.com")
      ? "android"
      : "unknown";
    track("open_in_giigs_clicked", { show_id: showId, platform });
    track("store_redirected", { show_id: showId, store });
  };

  // Secondary path for people who already have the app installed.
  const openApp = () => {
    const storeUrl = platform === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    track("open_in_giigs_clicked", {
      show_id: showId,
      platform,
      mode: "deep_link",
    });

    if (platform === "android") {
      // intent:// opens the app if installed and cleanly falls back to the
      // Play Store if not — no glitch, no manual timer, no error dialog.
      window.location.href = `intent://events/${encodeURIComponent(
        showId
      )}#Intent;scheme=giigs;package=com.brentpurks.Gigs;S.browser_fallback_url=${encodeURIComponent(
        storeUrl
      )};end`;
      return;
    }

    // iOS: fire the scheme, and if the app doesn't take over, go to the store.
    let appOpened = false;
    const markOpened = () => {
      appOpened = true;
    };
    document.addEventListener("visibilitychange", markOpened);
    window.addEventListener("pagehide", markOpened);
    window.addEventListener("blur", markOpened);

    window.location.href = `giigs://events/${encodeURIComponent(showId)}`;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", markOpened);
      window.removeEventListener("pagehide", markOpened);
      window.removeEventListener("blur", markOpened);
      if (appOpened || document.hidden) return;
      track("store_redirected", { show_id: showId, store: platform });
      window.location.href = storeUrl;
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div onClick={onBadgeClick} className="flex justify-center">
        <StoreBadges size={160} />
      </div>
      {isMobile && (
        <button
          type="button"
          onClick={openApp}
          className="text-sm font-medium text-[#c9a2ff] underline underline-offset-4 transition hover:text-white"
        >
          Already have the app? Open in Giigs
        </button>
      )}
    </div>
  );
}
