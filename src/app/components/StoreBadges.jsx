import React from "react";
import Image from "next/image";
import Link from "next/link";

export const APP_STORE_URL = "https://apps.apple.com/us/app/giigs/id6467974842";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.brentpurks.Gigs&pcampaignid=web_share";

const StoreBadges = ({ className = "", size = 180 }) => {
  const height = Math.round((size / 180) * 54);
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={APP_STORE_URL}
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
      </Link>
      <Link
        href={PLAY_STORE_URL}
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
      </Link>
    </div>
  );
};

export default StoreBadges;
