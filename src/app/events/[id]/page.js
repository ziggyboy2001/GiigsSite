/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";

import getShowByID from "../../../lib/getShowByID";
import getRelatedShows from "../../../lib/getRelatedShows";
import {
  formatDateLong,
  formatTime,
  formatTzAbbr,
  isoDateInZone,
} from "../../../lib/formatShowDate";
import EventAnalytics from "./_components/EventAnalytics";
import ShareButton from "./_components/ShareButton";
import TicketButton from "./_components/TicketButton";
import OpenInGiigs from "./_components/OpenInGiigs";
import ShowRail from "./_components/ShowRail";

const SITE_URL = "https://giigsapp.com";

// ── Presentation helpers ────────────────────────────────────────────
function coverText(cover) {
  if (!cover) return null;
  if (cover.label) return cover.label;
  if (cover.amountCents == null) return null;
  if (cover.amountCents === 0) return "Free";
  return `$${Math.round(cover.amountCents / 100)} cover`;
}

function buildDescription(show) {
  const bits = [];
  if (show.artist) bits.push(show.artist);
  if (show.venue?.name) bits.push(`at ${show.venue.name}`);
  const date = formatDateLong(show.startsAt, show.timezone);
  if (date) bits.push(`· ${date}`);
  const base = bits.join(" ").trim();
  return base
    ? `${base}. Find live music near you on Giigs.`
    : "Find live music near you on Giigs.";
}

// schema.org MusicEvent — the highest-ROI SEO piece (gets us into Google's
// event results). Only emits fields we actually have; Google's required trio
// (name, startDate, location) is always present for a real show.
function buildEventJsonLd(show, id) {
  const name = show.venue?.name
    ? `${show.artist || show.title || "Live music"} at ${show.venue.name}`
    : show.artist || show.title || "Live music";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    url: `${SITE_URL}/events/${id}`,
    startDate: show.startsAt || undefined,
    endDate: show.endsAt || undefined,
    eventStatus:
      show.state === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [
      show.heroImageUrl ||
        show.thumbImageUrl ||
        `${SITE_URL}/events/${id}/og`,
    ],
    description: show.description || undefined,
  };

  if (show.artist) {
    jsonLd.performer = { "@type": "MusicGroup", name: show.artist };
  }

  if (show.venue?.name || show.venue?.address) {
    const place = { "@type": "Place", name: show.venue?.name || undefined };
    if (show.venue?.address) {
      place.address = show.venue.address;
    }
    if (Number.isFinite(show.venue?.lat) && Number.isFinite(show.venue?.lng)) {
      place.geo = {
        "@type": "GeoCoordinates",
        latitude: show.venue.lat,
        longitude: show.venue.lng,
      };
    }
    jsonLd.location = place;
  }

  // Offers: only meaningful when we have a ticket link or a known price.
  const hasCover = show.cover?.amountCents != null;
  if (show.ticketUrl || hasCover) {
    const offer = {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    };
    if (show.ticketUrl) offer.url = show.ticketUrl;
    if (hasCover) {
      offer.price = (show.cover.amountCents / 100).toFixed(2);
      offer.priceCurrency = "USD";
    }
    jsonLd.offers = offer;
  }

  return jsonLd;
}

function directionsUrl(venue) {
  if (!venue) return null;
  if (Number.isFinite(venue.lat) && Number.isFinite(venue.lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
  }
  if (venue.address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      venue.address,
    )}`;
  }
  return null;
}

// ── SEO metadata (basic; dynamic OG image + JSON-LD land in Phase 3) ──
export async function generateMetadata({ params }) {
  const show = await getShowByID(params.id);
  if (!show) return { title: "Show not found", robots: { index: false } };

  const title = show.venue?.name
    ? `${show.artist || "Live music"} at ${show.venue.name}`
    : show.artist || "Live music";
  const description = buildDescription(show);
  // Prefer the real hero photo for the share preview; otherwise fall back to the
  // on-brand generated OG image (/events/[id]/og). Relative path is absolutized
  // against metadataBase (giigsapp.com) from the root layout.
  const ogImage =
    show.heroImageUrl || show.thumbImageUrl || `/events/${params.id}/og`;
  const images = [{ url: ogImage, width: 1200, height: 630 }];
  const url = `${SITE_URL}/events/${params.id}`;

  return {
    title,
    description,
    alternates: { canonical: `/events/${params.id}` },
    openGraph: { type: "article", title, description, url, images },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: show.indexable ? undefined : { index: false, follow: true },
  };
}

// ── Page ─────────────────────────────────────────────────────────────
export default async function EventPage({ params }) {
  const show = await getShowByID(params.id);
  if (!show) notFound();

  // Related rails (never block the page — getRelatedShows resolves to empty on
  // any failure). Fetched after the show so a missing show still 404s fast.
  const { fromArtist, similar } = await getRelatedShows(params.id);
  const artistRailTitle = show.artist
    ? `More from ${show.artist}`
    : "More upcoming shows";

  const tz = show.timezone;
  const heroSrc = show.heroImageUrl || show.thumbImageUrl || null;
  const dateLong = formatDateLong(show.startsAt, tz);
  const timeStr = formatTime(show.startsAt, tz);
  const tzAbbr = formatTzAbbr(show.startsAt, tz);
  const doorsStr = show.doorsAt ? formatTime(show.doorsAt, tz) : null;
  const cover = coverText(show.cover);
  const dir = directionsUrl(show.venue);
  const tags = [...(show.genres || []), ...(show.vibeTags || [])];

  const isCancelled = show.state === "cancelled";
  const isPast = show.state === "past";
  const jsonLd = buildEventJsonLd(show, params.id);

  return (
    <main className="flex min-h-screen flex-col bg-[#121212] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventAnalytics showId={show.id} state={show.state} />
      {/* Minimal header — self-contained (homepage Navbar uses page anchors) */}
      <header className="border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-12">
          <Link href="/" className="flex items-center" aria-label="Giigs home">
            <img
              src="/images/giigsVector.png"
              alt="Giigs"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton
              showId={show.id}
              title={`${show.artist || "Live music"}${
                show.venue?.name ? ` at ${show.venue.name}` : ""
              }`}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
            />
            <Link
              href="/#download"
              className="rounded-full bg-[#8338ec] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#9450f0]"
            >
              Get the app
            </Link>
          </div>
        </div>
      </header>

      <article className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* State banner */}
        {isCancelled && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
            This show has been cancelled.
          </div>
        )}
        {isPast && !isCancelled && (
          <div className="mb-6 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-[#ADB7BE]">
            This show has ended.
          </div>
        )}

        {/* Hero */}
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#8338ec] via-[#4a1e8f] to-[#160a29] ring-1 ring-[#8338ec]/30">
          {heroSrc ? (
            <img
              src={heroSrc}
              alt={`${show.artist || "Live show"}${
                show.venue?.name ? ` at ${show.venue.name}` : ""
              }`}
              className={`h-full w-full object-cover ${
                isCancelled || isPast ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <img
                src="/images/giigsVector.png"
                alt=""
                aria-hidden="true"
                className="h-14 w-auto opacity-90 drop-shadow-lg"
              />
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {show.artist || show.title || "Live music"}
              </span>
            </div>
          )}
        </div>

        {/* Title block */}
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {show.artist || show.title || "Live music"}
        </h1>
        {show.venue?.name && (
          <p className="mt-1 text-lg text-[#ADB7BE]">{show.venue.name}</p>
        )}

        {/* Facts */}
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dateLong && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-[#7a828c]">
                When
              </dt>
              <dd className="mt-1 font-semibold">
                <time dateTime={isoDateInZone(show.startsAt, tz)}>
                  {dateLong}
                </time>
                {timeStr && (
                  <span className="block font-normal text-[#ADB7BE]">
                    {timeStr}
                    {tzAbbr ? ` ${tzAbbr}` : ""}
                    {doorsStr ? ` · Doors ${doorsStr}` : ""}
                  </span>
                )}
              </dd>
            </div>
          )}
          {(show.venue?.name || show.venue?.address) && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-[#7a828c]">
                Where
              </dt>
              <dd className="mt-1 font-semibold">
                {show.venue?.name}
                {show.venue?.address && (
                  <span className="block font-normal text-[#ADB7BE]">
                    {show.venue.address}
                  </span>
                )}
                {dir && (
                  <a
                    href={dir}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-medium text-[#a578f6] hover:text-[#c4a4fa]"
                  >
                    Get directions →
                  </a>
                )}
              </dd>
            </div>
          )}
          {cover && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-[#7a828c]">
                Cover
              </dt>
              <dd className="mt-1 font-semibold">{cover}</dd>
            </div>
          )}
        </dl>

        {/* Tickets */}
        {show.ticketUrl && !isCancelled && (
          <TicketButton
            showId={show.id}
            url={show.ticketUrl}
            label={isPast ? "Ticket info" : "Get tickets"}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#8338ec] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0] sm:w-auto"
          />
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[#ADB7BE]"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {show.description && (
          <div className="mt-6 whitespace-pre-line leading-relaxed text-[#ADB7BE]">
            {show.description}
          </div>
        )}

        {/* Related rails — more from this artist + more like this. Each hides
            itself when the backend has nothing to suggest. */}
        <ShowRail title={artistRailTitle} shows={fromArtist} />
        <ShowRail title="More shows like this" shows={similar} />

        {/* CTA (device detection + funnel tracking arrive in Phase 4) */}
        <section className="mt-10 rounded-2xl border border-[#8338ec]/30 bg-gradient-to-b from-[#8338ec]/10 to-white/5 p-6 text-center">
          <Link
            href="/"
            aria-label="Giigs home"
            className="mx-auto mb-3 inline-block"
          >
            <img
              src="/images/giigsVector.png"
              alt="Giigs"
              className="h-14 w-auto drop-shadow-lg transition hover:opacity-90"
            />
          </Link>
          <h2 className="text-xl font-bold">Open this show on Giigs</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#ADB7BE]">
            See it on the live map, get directions, build a bar crawl, and find
            more live music near you.
          </p>
          <div className="mt-4 flex justify-center">
            <OpenInGiigs showId={show.id} />
          </div>
        </section>
      </article>

      <footer className="mt-auto border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-sm text-[#7a828c] sm:flex-row sm:justify-between sm:px-6 lg:px-12">
          <span>© {new Date().getFullYear()} Giigs · Giigs Inc</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/termsofservice" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
