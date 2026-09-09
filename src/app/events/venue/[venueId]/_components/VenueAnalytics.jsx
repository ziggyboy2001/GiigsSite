"use client";

import { useEffect } from "react";

import { track } from "../../../../../lib/analytics";

// Fires the top-of-funnel event once per venue landing view. Renders nothing.
// For a QR campaign this is the "X people came from the Marigny QR / landed"
// step — campaign super-properties (venue/campaign/placement) ride along
// automatically from analytics.js, so it filters by campaign for free.
export default function VenueAnalytics({ venueSlug, venueName, upcomingCount }) {
  useEffect(() => {
    track("venue_page_viewed", {
      venue_id: venueSlug,
      venue_name: venueName,
      upcoming_count: upcomingCount,
    });
  }, [venueSlug, venueName, upcomingCount]);
  return null;
}
