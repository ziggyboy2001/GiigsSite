const SITE_URL = "https://giigsapp.com";

// Same backend base as getShowByID; the site stays DB-free and pulls the list of
// eligible shows from the public API. Trailing slash tolerated.
const API_BASE = (
  process.env.GIIGS_API_BASE_URL || "https://gigsserver.onrender.com/api"
).replace(/\/+$/, "");

// Revalidate the sitemap hourly (matches the backend feed's s-maxage).
export const revalidate = 3600;

async function getSitemapShows() {
  try {
    const res = await fetch(`${API_BASE}/public/sitemap`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    // Never let a backend hiccup break the whole sitemap — fall back to the
    // static routes below.
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const staticEntries = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termsofservice`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const shows = await getSitemapShows();
  const showEntries = shows.map((s) => ({
    url: `${SITE_URL}/events/${s.id}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticEntries, ...showEntries];
}
