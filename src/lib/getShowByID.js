/**
 * getShowByID — server-side fetch for a public show.
 *
 * The website stays DB-free (see plans/SHAREABLE_SHOW_LINKS.md §2): this is a
 * thin server fetch to the Giigs backend's public endpoint, which is the single
 * place the visibility gate is enforced. Never import a DB client here.
 *
 * Returns the public show payload, or `null` when the show is missing / not
 * eligible (backend replies 404). Any other failure throws so the route can
 * surface a 5xx instead of silently rendering an empty page.
 */

// Backend base, e.g. https://gigsserver.onrender.com/api . Overridable via env
// for release/staging/local. Trailing slash tolerated.
const API_BASE = (
  process.env.GIIGS_API_BASE_URL || "https://gigsserver.onrender.com/api"
).replace(/\/+$/, "");

export async function getShowByID(externalId) {
  if (!externalId || typeof externalId !== "string") return null;

  const url = `${API_BASE}/public/shows/${encodeURIComponent(externalId)}`;

  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      // ISR: cache the fetch and revalidate every 5 min, matching the
      // backend's s-maxage. Shows change rarely.
      next: { revalidate: 300 },
    });
  } catch (err) {
    // Network/DNS/timeout — treat as a hard error so we don't cache a 404.
    throw new Error(`getShowByID: fetch failed for ${externalId}: ${err.message}`);
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getShowByID: backend ${res.status} for ${externalId}`);
  }

  return res.json();
}

export default getShowByID;
