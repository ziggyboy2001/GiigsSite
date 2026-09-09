/* eslint-disable @next/next/no-img-element */
import { formatDateShort, formatTime } from "../../../../lib/formatShowDate";
import TrackedLink from "../../../components/analytics/TrackedLink";

/**
 * Horizontal, side-scrollable rail of related shows for the public event page.
 * Server-rendered cards (via the client TrackedLink island) so the internal
 * links stay crawlable (SEO) and no client JS is needed for the scroll (native
 * overflow-x + scroll-snap).
 *
 * @param {string} title       Section heading (e.g. "More from The Revivalists").
 * @param {Array}  shows       Public show payloads (from getRelatedShows).
 * @param {string} fromShowId  The event page these related shows are shown on.
 * @param {string} rail        Which rail this is ("artist" | "similar") — for analytics.
 */
export default function ShowRail({ title, shows, fromShowId, rail }) {
  if (!Array.isArray(shows) || shows.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold text-white">{title}</h2>
      <div
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
        role="list"
      >
        {shows.map((s, i) => (
          <RailCard
            key={s.id}
            show={s}
            fromShowId={fromShowId}
            rail={rail}
            position={i}
          />
        ))}
      </div>
    </section>
  );
}

function RailCard({ show, fromShowId, rail, position }) {
  const img = show.heroImageUrl || show.thumbImageUrl || null;
  const artist = show.artist || show.title || "Live music";
  const venue = show.venue?.name || "";
  const tz = show.timezone;
  const dateShort = formatDateShort(show.startsAt, tz);
  const timeStr = formatTime(show.startsAt, tz);
  const meta = [dateShort, timeStr].filter(Boolean).join(" · ");

  return (
    <TrackedLink
      href={`/events/${show.id}`}
      event="related_show_clicked"
      properties={{
        from_show_id: fromShowId,
        to_show_id: show.id,
        rail,
        position,
        artist,
      }}
      role="listitem"
      className="group w-40 flex-shrink-0 snap-start"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#8338ec] via-[#4a1e8f] to-[#160a29] ring-1 ring-white/10">
        {img ? (
          <img
            src={img}
            alt={`${artist}${venue ? ` at ${venue}` : ""}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
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
      </div>
      <p className="mt-2 truncate text-sm font-bold text-white" title={artist}>
        {artist}
      </p>
      {venue && (
        <p className="truncate text-xs font-medium text-[#ADB7BE]" title={venue}>
          {venue}
        </p>
      )}
      {meta && <p className="truncate text-xs text-[#7a828c]">{meta}</p>}
    </TrackedLink>
  );
}
