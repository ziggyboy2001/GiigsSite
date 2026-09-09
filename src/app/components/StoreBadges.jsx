import React from "react";
import Image from "next/image";
import TrackedLink from "./analytics/TrackedLink";

export const APP_STORE_URL = "https://apps.apple.com/app/id6467974842";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.brentpurks.Gigs&pcampaignid=web_share";

// `location` labels WHERE on the site the badge was tapped (hero, download,
// footer, event_page…) so the same `app_store_badge` / `play_store_badge`
// events can be broken down by placement in PostHog.
const StoreBadges = ({ className = "", size = 180, location = "unknown" }) => {
  const height = Math.round((size / 180) * 54);
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <TrackedLink
        href={APP_STORE_URL}
        label="app_store_badge"
        properties={{ location, store: "ios" }}
        aria-label="Download Giigs on the App Store"
        className="transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Image
          src="/images/appStore.png"
          alt="Download Giigs on the Apple App Store"
          width={size}
          height={height}
          className="h-[54px] w-auto object-contain rounded-lg"
        />
      </TrackedLink>
      <TrackedLink
        href={PLAY_STORE_URL}
        label="play_store_badge"
        properties={{ location, store: "android" }}
        aria-label="Get Giigs on Google Play"
        className="transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Image
          src="/images/googlePlay.png"
          alt="Get Giigs on Google Play"
          width={size}
          height={height}
          className="h-[54px] w-auto object-contain rounded-lg"
        />
      </TrackedLink>
    </div>
  );
};

export default StoreBadges;
