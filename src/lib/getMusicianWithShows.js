/**
 * getMusicianWithShows — server-side fetch for a public artist page.
 *
 * Mirrors getVenueWithShows: the website stays DB-free, so this is a thin server
 * fetch to the Giigs backend's public endpoint (`GET /api/public/musicians/:slug`),
 * which owns the visibility gate and the platform/non-platform resolution. Never
 * import a DB client here.
 *
 * `slug` is the musician id, username slug, or a non-platform act's name slug
 * (e.g. `hot-8-brass-band`). Returns `{ musician, shows }` or `null` when the
 * artist is unknown (backend 404). Other failures throw so the route surfaces a
 * 5xx instead of caching an empty page.
 */

const API_BASE = (
  process.env.GIIGS_API_BASE_URL || "https://gigsserver.onrender.com/api"
).replace(/\/+$/, "");

export async function getMusicianWithShows(slug) {
  if (!slug || typeof slug !== "string") return null;

  const url = `${API_BASE}/public/musicians/${encodeURIComponent(slug)}`;

  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      // ISR: cache + revalidate every 5 min, matching the backend's s-maxage.
      next: { revalidate: 300 },
    });
  } catch (err) {
    throw new Error(
      `getMusicianWithShows: fetch failed for ${slug}: ${err.message}`,
    );
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getMusicianWithShows: backend ${res.status} for ${slug}`);
  }

  const data = await res.json();
  return {
    musician: data?.musician || null,
    shows: Array.isArray(data?.shows) ? data.shows : [],
  };
}

export default getMusicianWithShows;
