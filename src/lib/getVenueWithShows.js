/**
 * getVenueWithShows — server-side fetch for a public venue landing page.
 *
 * Mirrors getShowByID: the website stays DB-free, so this is a thin server fetch
 * to the Giigs backend's public endpoint (`GET /api/public/venues/:slug`), which
 * is the single place the visibility gate lives. Never import a DB client here.
 *
 * The slug is the normalized venue name (hyphen/space-insensitive), e.g.
 * `marigny-opera-house`. Returns `{ venue, shows }` or `null` when the venue is
 * unknown (backend replies 404). Any other failure throws so the route can
 * surface a 5xx instead of silently rendering an empty page.
 */

// Backend base, e.g. https://gigsserver.onrender.com/api . Overridable via env
// for release/staging/local. Trailing slash tolerated.
const API_BASE = (
  process.env.GIIGS_API_BASE_URL || "https://gigsserver.onrender.com/api"
).replace(/\/+$/, "");

export async function getVenueWithShows(slug) {
  if (!slug || typeof slug !== "string") return null;

  const url = `${API_BASE}/public/venues/${encodeURIComponent(slug)}`;

  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      // ISR: cache the fetch and revalidate every 5 min, matching the backend's
      // s-maxage. A venue's upcoming list changes slowly.
      next: { revalidate: 300 },
    });
  } catch (err) {
    // Network/DNS/timeout — hard error so we don't cache a 404.
    throw new Error(`getVenueWithShows: fetch failed for ${slug}: ${err.message}`);
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getVenueWithShows: backend ${res.status} for ${slug}`);
  }

  const data = await res.json();
  return {
    venue: data?.venue || null,
    shows: Array.isArray(data?.shows) ? data.shows : [],
  };
}

export default getVenueWithShows;
