/**
 * Date/time formatting for public show pages.
 *
 * The backend sends UTC ISO instants (`startsAt`, `doorsAt`, `endsAt`) plus an
 * IANA `timezone` derived from the venue coords. We render the instants in that
 * zone so an Atlanta show reads in Eastern and a NOLA show in Central — never the
 * server's or the visitor's local zone.
 */

const FALLBACK_TZ = "America/Chicago";

function fmt(iso, tz, options) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz || FALLBACK_TZ,
      ...options,
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: FALLBACK_TZ,
      ...options,
    }).format(d);
  }
}

/** "Saturday, August 1, 2026" */
export function formatDateLong(iso, tz) {
  return fmt(iso, tz, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "9:30 PM" */
export function formatTime(iso, tz) {
  return fmt(iso, tz, { hour: "numeric", minute: "2-digit", hour12: true });
}

/** "Fri, Aug 8" — compact form for rail cards. */
export function formatDateShort(iso, tz) {
  return fmt(iso, tz, { weekday: "short", month: "short", day: "numeric" });
}

/** Short zone abbreviation for the instant, e.g. "CDT" / "EST". */
export function formatTzAbbr(iso, tz) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz || FALLBACK_TZ,
      timeZoneName: "short",
    }).formatToParts(d);
    return parts.find((p) => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

/** Compact ISO date (YYYY-MM-DD) in the venue zone, for <time dateTime>. */
export function isoDateInZone(iso, tz) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    // en-CA yields YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz || FALLBACK_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}
