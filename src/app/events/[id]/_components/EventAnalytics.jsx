"use client";

import { useEffect } from "react";

import { track } from "../../../../lib/analytics";

// Fires the top-of-funnel event once per show page view. Renders nothing.
export default function EventAnalytics({ showId, state }) {
  useEffect(() => {
    track("event_link_viewed", { show_id: showId, state });
  }, [showId, state]);
  return null;
}
