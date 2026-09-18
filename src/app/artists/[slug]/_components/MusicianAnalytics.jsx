"use client";

import { useEffect } from "react";

import { track } from "../../../../lib/analytics";

// Top-of-funnel event, once per artist page view. Renders nothing. Campaign
// super-properties (venue/campaign/placement/utm) ride along automatically from
// analytics.js, so QR/campaign attribution filters for free.
export default function MusicianAnalytics({
  artistSlug,
  artistName,
  platform,
  upcomingCount,
}) {
  useEffect(() => {
    track("artist_page_viewed", {
      artist_slug: artistSlug,
      artist_name: artistName,
      platform,
      upcoming_count: upcomingCount,
    });
  }, [artistSlug, artistName, platform, upcomingCount]);
  return null;
}
