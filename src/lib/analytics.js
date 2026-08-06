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
        capture_pageview: false, // we fire event_link_viewed explicitly
        person_profiles: "identified_only",
      });
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

export default track;
