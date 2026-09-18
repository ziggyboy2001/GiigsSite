/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";

import getMusicianWithShows from "../../../lib/getMusicianWithShows";
import { formatDateShort, formatTime } from "../../../lib/formatShowDate";
import TrackedLink from "../../components/analytics/TrackedLink";
import MusicianAnalytics from "./_components/MusicianAnalytics";
import ListenSection from "./_components/ListenSection";
import SocialIcon from "./_components/SocialIcon";

const SITE_URL = "https://giigsapp.com";

// Social networks we render (label + how to present the URL). Order = priority.
const SOCIAL_META = {
  spotify: { label: "Spotify" },
  appleMusic: { label: "Apple Music" },
  youtube: { label: "YouTube" },
  soundcloud: { label: "SoundCloud" },
  bandcamp: { label: "Bandcamp" },
  instagram: { label: "Instagram" },
  tiktok: { label: "TikTok" },
  facebook: { label: "Facebook" },
  x: { label: "X" },
  twitter: { label: "X" },
  website: { label: "Website" },
};

function socialLinks(socials) {
  if (!socials) return [];
  return Object.keys(SOCIAL_META)
    .filter((k) => socials[k])
    .map((k) => ({ network: k, label: SOCIAL_META[k].label, url: socials[k] }));
}

// Group the (already chronologically sorted) shows into month buckets.
function groupByMonth(shows) {
  const groups = [];
  const index = new Map();
  let position = 0;
  for (const s of shows) {
    let key = "upcoming";
    let label = "Upcoming";
    const d = s.startsAt ? new Date(s.startsAt) : null;
    if (d && !Number.isNaN(d.getTime())) {
      const tz = s.timezone || "America/Chicago";
      key = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
      }).format(d);
      label = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        month: "long",
        year: "numeric",
      })
        .format(d)
        .toUpperCase();
    }
    if (!index.has(key)) {
      const g = { key, label, shows: [] };
      index.set(key, g);
      groups.push(g);
    }
    index.get(key).shows.push({ show: s, position: position++ });
  }
  return groups;
}

// schema.org MusicGroup + an ItemList of upcoming MusicEvents (performer = the
// artist). Gives Google an artist entity and threads every show into results.
function buildMusicianJsonLd(musician, shows, slug) {
  const performer = { "@type": "MusicGroup", name: musician.name };
  if (musician.imageUrl) performer.image = musician.imageUrl;
  performer.url = `${SITE_URL}/artists/${slug}`;
  if (Array.isArray(musician.genres) && musician.genres.length) {
    performer.genre = musician.genres;
  }
  const sameAs = socialLinks(musician.socials).map((s) => s.url);
  if (sameAs.length) performer.sameAs = sameAs;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Upcoming shows — ${musician.name}`,
    itemListElement: shows.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicEvent",
        name: s.venue?.name
          ? `${musician.name} at ${s.venue.name}`
          : musician.name,
        url: `${SITE_URL}/events/${s.id}`,
        startDate: s.startsAt || undefined,
        endDate: s.endsAt || undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: s.heroImageUrl || s.thumbImageUrl || undefined,
        performer,
        location: s.venue?.name
          ? { "@type": "MusicVenue", name: s.venue.name, address: s.venue.address || undefined }
          : undefined,
      },
    })),
  };
}

// ── SEO metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const data = await getMusicianWithShows(params.slug);
  if (!data || !data.musician) {
    return { title: "Artist not found", robots: { index: false } };
  }
  const { musician } = data;
  const key = musician.slug || params.slug;
  const title = `${musician.name} — live shows`;
  const description = `Upcoming shows and music from ${musician.name}. Find live music near you on Giigs.`;
  const url = `${SITE_URL}/artists/${key}`;
  const ogImage = musician.imageUrl || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/artists/${key}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Page ─────────────────────────────────────────────────────────────
export default async function ArtistPage({ params }) {
  const data = await getMusicianWithShows(params.slug);
  if (!data || !data.musician) notFound();

  const { musician, shows } = data;
  const key = musician.slug || params.slug;
  // Only render a location when it's REAL data. Drop blanks and placeholder
  // junk like "none"/"n/a" that some profiles carry, so we never show
  // "none, none" in the hero.
  const cleanLoc = (v) => {
    if (v == null) return null;
    const t = String(v).trim();
    if (!t) return null;
    if (["none", "n/a", "na", "null", "-", ".", "tbd"].includes(t.toLowerCase()))
      return null;
    return t;
  };
  const cityState = [cleanLoc(musician.city), cleanLoc(musician.state)]
    .filter(Boolean)
    .join(", ");
  const jsonLd = buildMusicianJsonLd(musician, shows, key);
  const monthGroups = groupByMonth(shows);
  const socials = socialLinks(musician.socials);
  const genres = (musician.genres || []).slice(0, 6);

  const nextShow = shows[0] || null;
  const nextLabel = nextShow
    ? formatDateShort(nextShow.startsAt, nextShow.timezone)
    : null;

  return (
    <main className="flex min-h-screen flex-col bg-[#0d0d0f] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MusicianAnalytics
        artistSlug={key}
        artistName={musician.name}
        platform={musician.source}
        upcomingCount={musician.upcomingCount ?? shows.length}
      />

      {/* Co-labelled header — "{Artist} × Giigs" */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0d0f]/85 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-12">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span
              className="truncate text-base font-bold tracking-tight sm:text-lg"
              title={musician.name}
            >
              {musician.name}
            </span>
            <span
              aria-hidden="true"
              className="select-none text-lg font-light text-white/25 sm:text-xl"
            >
              ✕
            </span>
            <TrackedLink
              href="/"
              label="artist_header_logo"
              properties={{ artist_id: key }}
              className="flex flex-shrink-0 items-center"
              aria-label="Giigs home"
            >
              <img
                src="/images/giigsVector.png"
                alt="Giigs"
                className="h-7 w-auto sm:h-8"
              />
            </TrackedLink>
          </div>
          <TrackedLink
            href="/#download"
            event="get_app_clicked"
            properties={{ artist_id: key, location: "artist_header" }}
            className="flex-shrink-0 rounded-full bg-[#8338ec] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#9450f0]"
          >
            {"See What's Live →"}
          </TrackedLink>
        </div>
      </header>

      <article className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d1030] via-[#150a24] to-[#0b0b0d]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#8338ec]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#ff006e]/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 p-7 sm:p-11">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8338ec]/40 bg-[#8338ec]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a6ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8338ec]" />
              Artist
            </span>

            <div className="flex items-start gap-4 sm:gap-5">
              {musician.imageUrl && (
                <img
                  src={musician.imageUrl}
                  alt={musician.name}
                  className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover shadow-2xl ring-1 ring-white/20 sm:h-28 sm:w-28"
                />
              )}
              <div className="flex min-w-0 flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                  {musician.name}
                </h1>
                {(genres.length > 0 || cityState) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10"
                      >
                        {g}
                      </span>
                    ))}
                    {cityState && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/60">
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-[#a578f6]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                        </svg>
                        {cityState}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {musician.bio && (
              <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/75 sm:text-base">
                {musician.bio}
              </p>
            )}

            {shows.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8338ec] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8338ec]" />
                  </span>
                  {shows.length} upcoming {shows.length === 1 ? "show" : "shows"}
                </span>
                {nextLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/70 ring-1 ring-white/10">
                    Next · {nextLabel}
                  </span>
                )}
              </div>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <TrackedLink
                href="/#download"
                event="get_app_clicked"
                properties={{ artist_id: key, location: "artist_hero" }}
                className="inline-flex items-center justify-center rounded-full bg-[#8338ec] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0]"
              >
                {"See What's Live →"}
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* Listen (conditional cascade: audio → streaming link → nothing) */}
        <ListenSection
          artistSlug={key}
          audio={musician.audio}
          socials={musician.socials}
        />

        {/* Follow / socials */}
        {socials.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-extrabold tracking-tight sm:text-2xl">
              Follow
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {socials.map((s) => (
                <TrackedLink
                  key={s.network}
                  href={s.url}
                  event="artist_social_clicked"
                  properties={{ artist_id: key, network: s.network }}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <SocialIcon network={s.network} />
                </TrackedLink>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming shows */}
        <div className="mt-12 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Upcoming shows
          </h2>
          {shows.length > 0 && (
            <span className="text-sm font-medium text-[#7a828c]">
              {shows.length} listed
            </span>
          )}
        </div>

        {shows.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-14 text-center">
            <img
              src="/images/giigsVector.png"
              alt=""
              aria-hidden="true"
              className="mb-4 h-12 w-auto opacity-80 drop-shadow"
            />
            <p className="text-lg font-bold text-white">
              No upcoming shows listed yet
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#ADB7BE]">
              New shows get added all the time — open Giigs to explore live
              music near you and be first to know when {musician.name} announces
              their next date.
            </p>
            <div className="mt-6">
              <TrackedLink
                href="/#download"
                event="get_app_clicked"
                properties={{ artist_id: key, location: "artist_empty_state" }}
                className="inline-flex items-center justify-center rounded-full bg-[#8338ec] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0]"
              >
                Get the app
              </TrackedLink>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {monthGroups.map((g) => (
              <section key={g.key}>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#a578f6]">
                    {g.label}
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-medium text-[#7a828c]">
                    {g.shows.length} {g.shows.length === 1 ? "show" : "shows"}
                  </span>
                </div>
                <ul
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
                  role="list"
                >
                  {g.shows.map(({ show, position }) => (
                    <ArtistShowCard
                      key={show.id}
                      show={show}
                      artistId={key}
                      position={position}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* CTA */}
        <section className="mt-14 overflow-hidden rounded-2xl border border-[#8338ec]/30 bg-gradient-to-b from-[#8338ec]/10 to-white/5 p-7 text-center">
          <TrackedLink
            href="/"
            label="artist_cta_logo"
            properties={{ artist_id: key }}
            aria-label="Giigs home"
            className="mx-auto mb-3 inline-block"
          >
            <img
              src="/images/giigsVector.png"
              alt="Giigs"
              className="h-20 w-auto drop-shadow-lg transition hover:opacity-90 sm:h-24"
            />
          </TrackedLink>
          <h2 className="text-xl font-bold">Find live music on Giigs</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#ADB7BE]">
            See shows on the live map, follow your favorite artists, get
            directions, and never miss a night out.
          </p>
          <div className="mt-4 flex justify-center">
            <TrackedLink
              href="/#download"
              event="get_app_clicked"
              properties={{ artist_id: key, location: "artist_cta" }}
              className="inline-flex items-center justify-center rounded-xl bg-[#8338ec] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0]"
            >
              Get the app
            </TrackedLink>
          </div>
        </section>
      </article>

      <footer className="mt-auto border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-sm text-[#7a828c] sm:flex-row sm:justify-between sm:px-6 lg:px-12">
          <span>© {new Date().getFullYear()} Giigs · Giigs Inc</span>
          <div className="flex gap-4">
            <TrackedLink
              href="/privacy"
              label="artist_footer_privacy"
              properties={{ artist_id: key }}
              className="hover:text-white"
            >
              Privacy
            </TrackedLink>
            <TrackedLink
              href="/termsofservice"
              label="artist_footer_terms"
              properties={{ artist_id: key }}
              className="hover:text-white"
            >
              Terms
            </TrackedLink>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ArtistShowCard({ show, artistId, position }) {
  const img = show.heroImageUrl || show.thumbImageUrl || null;
  const venueName = show.venue?.name || "";
  const title = show.title || show.artist || "Live music";
  const tz = show.timezone;
  const dateShort = formatDateShort(show.startsAt, tz);
  const timeStr = formatTime(show.startsAt, tz);

  return (
    <li role="listitem">
      <TrackedLink
        href={`/events/${show.id}`}
        event="artist_show_clicked"
        properties={{
          artist_id: artistId,
          to_show_id: show.id,
          position,
          venue: venueName,
        }}
        className="group block overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:ring-white/25"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#8338ec] via-[#4a1e8f] to-[#160a29]">
          {img ? (
            <img
              src={img}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-3 text-center">
              <img
                src="/images/giigsVector.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-auto opacity-90 drop-shadow"
              />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
          {dateShort && (
            <span className="absolute bottom-2 left-2 inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {dateShort}
              {timeStr ? ` · ${timeStr}` : ""}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-bold text-white" title={venueName || title}>
            {venueName || title}
          </p>
          <p className="mt-0.5 truncate text-xs font-medium text-[#a578f6]">
            View show →
          </p>
        </div>
      </TrackedLink>
    </li>
  );
}
