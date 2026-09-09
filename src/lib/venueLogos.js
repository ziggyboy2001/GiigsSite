// Per-venue brand logos shown on the venue landing page (nav bar + a
// faint hero watermark) in place of the generic avatar + venue name.
//
// To onboard a venue's logo: drop a transparent PNG/SVG in
// /public/venue-logos and map the venue's slug — and/or its platform
// profile id — to it here. Venues WITHOUT an entry simply render their
// name as text (no image), so this stays optional per venue.

const VENUE_LOGOS = {
  "marigny-opera-house": {
    src: "/venue-logos/marigny-opera-house.png",
    alt: "Marigny Opera House",
  },
  // Platform profile id (venue resolves to venue_profiles.id 147 on prod)
  147: {
    src: "/venue-logos/marigny-opera-house.png",
    alt: "Marigny Opera House",
  },
};

/**
 * Resolve a brand logo for a venue by any of its identifiers
 * (slug, canonical id, or platform profile id). Returns
 * `{ src, alt }` or null when the venue has no logo on file.
 */
export function getVenueLogo(venue) {
  if (!venue) return null;
  const keys = [venue.slug, venue.id, venue.profileId]
    .filter((v) => v != null && v !== "")
    .map(String);
  for (const k of keys) {
    if (VENUE_LOGOS[k]) return VENUE_LOGOS[k];
  }
  return null;
}

export default getVenueLogo;
