/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from "next/server";

import getShowByID from "../../../../lib/getShowByID";
import { formatDateLong } from "../../../../lib/formatShowDate";

// Edge runtime is required for ImageResponse (Satori). No fs here — the logo is
// fetched over HTTP from the current origin so it works in dev and prod.
export const runtime = "edge";

const ACCENT = "#8338ec";

/**
 * On-brand 1200×630 OG image, generated from show data. This is referenced by
 * generateMetadata ONLY as the fallback for shows with no hero image (shows that
 * DO have a hero use the real photo as og:image for a richer preview). Purely
 * branded (logo + gradient + text) so it never depends on a remote photo fetch.
 */
export async function GET(request, { params }) {
  const show = await getShowByID(params.id).catch(() => null);
  const origin = new URL(request.url).origin;
  const logoUrl = `${origin}/images/giigsVector.png`;

  const artist = (show?.artist || show?.title || "Live music").slice(0, 64);
  const venue = show?.venue?.name || "";
  const date = show ? formatDateLong(show.startsAt, show.timezone) : "";
  const state = show?.state;
  const label =
    state === "cancelled"
      ? "Cancelled"
      : state === "past"
      ? "Past show"
      : "Live music";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(135deg, ${ACCENT} 0%, #4a1e8f 45%, #160a29 100%)`,
          color: "white",
          fontFamily: "sans-serif",
          padding: "64px",
        }}
      >
        {/* Faded logo watermark */}
        <img
          src={logoUrl}
          width={540}
          height={540}
          style={{
            position: "absolute",
            right: "-60px",
            bottom: "-80px",
            opacity: 0.14,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "720px",
            height: "100%",
          }}
        >
          <img src={logoUrl} width={128} height={128} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "26px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#e7d8ff",
                fontWeight: 700,
              }}
            >
              {label}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "68px",
                fontWeight: 800,
                lineHeight: 1.05,
                marginTop: "16px",
              }}
            >
              {artist}
            </div>
            {venue ? (
              <div
                style={{
                  display: "flex",
                  fontSize: "36px",
                  color: "#d9c9f7",
                  marginTop: "12px",
                }}
              >
                {venue}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", fontSize: "30px", color: "#c3aef0" }}>
            {date ? `${date} · giigsapp.com` : "giigsapp.com"}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
