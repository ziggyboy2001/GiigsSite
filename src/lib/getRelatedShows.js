/**
 * Fetch the two related-show rails for a public event page from the backend
 * (`GET /api/public/shows/:externalId/related`):
 *   { fromArtist: [...], similar: [...] }
 *
 * Resilient by design: any failure (network, 404, backend down) resolves to
 * empty rails so the event page still renders. Same API base + revalidate
 * window as getShowByID.
 */
const API_BASE = (
  process.env.GIIGS_API_BASE_URL || "https://gigsserver.onrender.com/api"
).replace(/\/*$/, "");

const EMPTY = { fromArtist: [], similar: [] };

export async function getRelatedShows(externalId) {
  if (!externalId || typeof externalId !== "string") return EMPTY;

  const url = `${API_BASE}/public/shows/${encodeURIComponent(
    externalId
  )}/related`;

  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
  } catch {
    return EMPTY;
  }

  if (!res.ok) return EMPTY;

  try {
    const data = await res.json();
    return {
      fromArtist: Array.isArray(data?.fromArtist) ? data.fromArtist : [],
      similar: Array.isArray(data?.similar) ? data.similar : [],
    };
  } catch {
    return EMPTY;
  }
}

export default getRelatedShows;
