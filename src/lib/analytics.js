/**
 * Minimal client-side analytics wrapper for the shareable-show funnel.
 *
 * No-ops safely until NEXT_PUBLIC_POSTHOG_KEY is set, so the pages work with or
 * without analytics configured — nothing blocks on a key. posthog-js is loaded
 * lazily (dynamic import) so it never ships in the server bundle and only costs
 * bytes in the browser once a key exists.
 *
 * Funnel events (see plans/SHAREABLE_SHOW_LINKS.md §9):
 *   event_link_viewed → tickets_clicked / share_clicked
 *                     → open_in_giigs_clicked → store_redirected
 */

let phPromise; // caches the init so we only load/init posthog once

// Campaign / source attribution read from the landing URL's query string.
// Scan-in example (what goes on a QR poster):
//   https://giigsapp.com/events/123?venue=marigny_opera_house&campaign=moh_launch_sep_2026&placement=poster
// Any of these present on entry get registered as PostHog super-properties, so
// they attach to EVERY event for the rest of that visitor's session/funnel.
const CAMPAIGN_PARAMS = [
  "venue",
  "campaign",
  "placement",
  "source",
  "medium",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function readCampaignProps() {
  if (typeof window === "undefined") return {};
  try {
    const sp = new URLSearchParams(window.location.search);
    const props = {};
    for (const key of CAMPAIGN_PARAMS) {
      const value = sp.get(key);
      if (value) props[key] = value;
    }
    return props;
  } catch {
    return {};
  }
}

function getPosthog() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (phPromise !== undefined) return phPromise;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    phPromise = Promise.resolve(null); // no key → permanent no-op
    return phPromise;
  }

  phPromise = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        // Pageviews are fired explicitly on every route change (App Router SPA
        // navigations aren't caught by posthog's default listener).
        capture_pageview: false,
        // Dwell-time / bounce depth for the marketing pages.
        capture_pageleave: true,
        // Broad interaction coverage (clicks, rageclicks) in addition to the
        // explicit, human-labelled `cta_clicked` events fired via trackClick().
        autocapture: true,
        person_profiles: "identified_only",
      });
      // The marketing site shares a PostHog project with the mobile app, so
      // stamp every event from here with a stable identifier. register() sets
      // super properties that persist and ride along on EVERYTHING —
      // autocapture, $pageview, cta_clicked, and the event-page funnel — so the
      // team can filter to just the website with `app = giigs-website`
      // (or `platform = web`).
      posthog.register({
        app: "giigs-website",
        platform: "web",
      });
      // Campaign attribution: if the visitor landed via a tagged link/QR,
      // register those params as super-properties (so they ride along on the
      // whole funnel — event view, related-show clicks, tickets, app opens) and
      // fire one explicit `campaign_landing` so "came from the QR" is countable.
      const campaign = readCampaignProps();
      if (Object.keys(campaign).length > 0) {
        posthog.register(campaign);
        posthog.capture("campaign_landing", campaign);
      }
      return posthog;
    })
    .catch(() => null);

  return phPromise;
}

export function track(event, properties = {}) {
  if (typeof window === "undefined") return;
  getPosthog().then((ph) => {
    if (ph) ph.capture(event, properties);
  });
}

/**
 * Kick off posthog init early (called once from the root AnalyticsProvider) so
 * autocapture starts on the very first paint instead of waiting for the first
 * explicit track() call.
 */
export function initAnalytics() {
  getPosthog();
}

/**
 * Explicit pageview. Fired on every route change so client-side (SPA)
 * navigations are captured, not just the first server-rendered load.
 */
export function capturePageview(properties = {}) {
  if (typeof window === "undefined") return;
  getPosthog().then((ph) => {
    if (!ph) return;
    ph.capture("$pageview", {
      $current_url: window.location.href,
      ...properties,
    });
  });
}

/**
 * Standardised, LABELLED press/click event. Every tracked button or link
 * funnels through here, so PostHog shows a clean `cta_clicked` event keyed by a
 * human-readable `label` (plus optional location + extra props) instead of
 * noisy autocapture selectors.
 */
export function trackClick(label, properties = {}) {
  track("cta_clicked", { label, ...properties });
}

/** Tie subsequent events to a stable id. Never pass raw PII. */
export function identify(distinctId, properties = {}) {
  if (typeof window === "undefined" || !distinctId) return;
  getPosthog().then((ph) => {
    if (ph) ph.identify(String(distinctId), properties);
  });
}

/** Clear identity (e.g. on sign-out) so a fresh funnel starts. */
export function reset() {
  if (typeof window === "undefined") return;
  getPosthog().then((ph) => {
    if (ph) ph.reset();
  });
}

export default track;
