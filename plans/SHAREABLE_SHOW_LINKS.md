# Shareable Show Links — `giigsapp.com/events/{id}`

**Status:** Phases 1–4 complete + Phase 5 groundwork wired. Web/backend (1–4) shippable now. Phase 5 native config is in place but only activates on the next **app build** (rides the fee release); two inputs still needed (Android SHA-256; verify well-known files post-deploy).
**Repos:** `GiigsWebsite` (SSR page + SEO), `gigsBackend` (public API), `Gigs` (app deep-link — final phase)
**Last updated:** 2026-08-04

---

## 1. Framing

`/events/{id}` is **not a landing page — it's the canonical, permanent, indexable
public URL for every Giigs show.** Once every show has one, artists link it from
IG bios, venues embed it, press references it, QR codes point at it, and Google
indexes it as a real event. Sharing is just the first use.

Backed by the **`shows`** table (discovery), NOT `events`. The `shows` table is
already purpose-built for this (see §3).

---

## 2. Architecture / data flow

```
Instagram/SMS link → giigsapp.com/events/{external_id}
      │
      ▼  (SSR, Next.js App Router)
  getShowByID(externalId)  ── server fetch ──▶  gigsBackend  GET /api/public/shows/:externalId
      │                                              │ (enforces visibility gate, returns public JSON)
      ▼
  Render page: <head> OG/Twitter/JSON-LD + body (image, artist, venue, date, tickets, map)
      │
      ▼  "Open this show on Giigs" CTA
   ┌─ app installed  → Universal Link / App Link opens app → discovery modal + map focus  (FINAL PHASE)
   └─ not installed  → device-detected App Store / Play Store redirect  (SHIPS DAY ONE)
```

**Key decision (locked):** the website stays **DB-free**. `getShowByID` is a thin
server-side fetch to a new backend endpoint. The backend owns `shows` + the
discovery serializers (`services/discovery/serializer.js`) and is the single place
the visibility gate is enforced — the marketing site can never accidentally query
and leak an ineligible row.

---

## 3. Data source — `shows` table (already exists)

Everything v1 needs is already a column (coverage from prod_copy, 5,258 rows):

| Need | Column | Coverage |
|---|---|---|
| **Public, non-enumerable ID** | `external_id` (uuid) | 100% ✅ — use this, not `id` |
| Hero image (OG 1200×630) | `hero_image_url` | ~54% → fallback via dynamic OG (§6) |
| Thumbnail | `thumb_image_url` | ~8% |
| Artist | `artist_name` / `artist_full_name` | ✅ |
| Venue | `venue_name_snapshot`, `venue_address_snapshot` | ✅ |
| Date / time / doors | `starts_at`, `ends_at`, `doors_at` (timestamptz) | ✅ |
| Ticket link | `ticket_url` | ~46% → CTA conditional |
| Map focus | `venue_lat`, `venue_long` | ~98.5% |
| State | `status` = `scheduled` / `completed` / `cancelled` | ✅ |
| Details | `description`, `genres[]`, `vibe_tags[]`, `cover_amount_cents`, `cover_label` | ✅ |
| Guards | `deleted_at`, `merged_into_id`, `confidence` | ✅ |

**Private-event safety is already guaranteed and requires NO work here.** The only
app-sourced rows (`primary_source='events'`) are promoted by
`services/discovery/index.js → syncEventToShows`, which **only promotes public
`gig` events and actively removes a row if `eventtype` flips to
private/corporate/wedding** (covered by tests). A private wedding can never reach
`shows`, so it can never get a public URL. Public-by-default is safe.

---

## 4. Backend — `GET /api/public/shows/:externalId`

New unauthenticated, cache-friendly endpoint (`gigsBackend`). Reuse discovery
serializers.

**Visibility gate (404 unless all true):**
- `deleted_at IS NULL` and `merged_into_id IS NULL`
- row exists for the given `external_id`
- (optional) `confidence >= THRESHOLD` → below threshold: serve but `noindex`

**Response states** (drive the page + `<meta name="robots">`):
- `scheduled` & `starts_at >= now` → **upcoming/live** (indexable)
- `completed` or `starts_at < now` → **past** (indexable, "This show has ended")
- `cancelled` → **cancelled** (indexable, "This show was cancelled")
- not found / deleted / merged → **404**

**Payload (public-safe fields only):**
```json
{
  "id": "external_id-uuid",
  "state": "upcoming|past|cancelled",
  "title": "...", "artist": "...", "venue": "...",
  "startsAt": "ISO", "endsAt": "ISO", "doorsAt": "ISO",
  "description": "...", "genres": [], "vibeTags": [],
  "cover": { "amountCents": 0, "label": "..." },
  "ticketUrl": "... | null",
  "heroImageUrl": "... | null",
  "venue": { "name": "...", "address": "...", "lat": 0, "lng": 0 },
  "indexable": true
}
```
- Set `Cache-Control` (e.g. `s-maxage=300, stale-while-revalidate=86400`); shows
  change rarely. CDN-cache at the website layer too.

**Timezone (added in impl):** `shows.starts_at` is a correct UTC instant but the
venue's display zone is computed at ingest and NOT persisted. The endpoint now
derives an IANA `timezone` from `venue_lat/long` (offline `tz-lookup`, defaults
`America/Chicago`) and returns it, so the page renders venue-local time correctly
across metros (NOLA=Central, Atlanta=Eastern) without the site touching coords.

**Shipped (Phase 1):** `gigsBackend/api/publicShows.js` (route + uuid guard +
visibility gate + cache headers), `gigsBackend/services/discovery/publicSerializer.js`
(allowlist-only public projection, separate from the playground serializer),
mounted at `/api/public` in `app.js`. New dep: `tz-lookup`.

---

## 5. Website — `/events/[id]` SSR page (Next 13 App Router)

New route `src/app/events/[id]/page.js` (+ `opengraph-image.js`, `not-found.js`).
Currently the site has **no DB layer** (only `resend`), which is exactly why §2
routes through the backend.

Page states (from `state`): **upcoming / past / cancelled / 404**. Each renders:
hero image (or generated OG), artist, venue, date/time (+ doors), description,
genres/vibe tags, cover, conditional **Tickets** button (`ticketUrl`), a static
map thumbnail focused on `lat/lng`, and the **"Open this show on Giigs"** CTA.

---

## 6. SEO (do NOT skip JSON-LD)

- **OG + Twitter meta** per show (title, description, image, url) via App Router
  `generateMetadata`.
- **Dynamic OG image** at **1200×630** using `next/og` `ImageResponse`
  (`opengraph-image.js`): composite artist + venue + date on-brand.
  **This doubles as the fallback** for the ~46% of shows with no `hero_image_url`.
- **JSON-LD `Event`** (schema.org) — the highest-ROI piece. Emit
  `MusicEvent` with `name`, `startDate`, `endDate`, `location` (Place + geo),
  `performer` (MusicGroup), `image`, `offers` (ticket url + price from cover),
  `eventStatus` (`EventScheduled`/`EventCancelled`), `eventAttendanceMode`.
  This is what gets us into Google **event results** instead of plain blue links.

---

## 7. CTA, device detection & store redirect  (ships day one, no app release)

- Device detection (UA) → Apple App Store vs Google Play.
- "Open this show on Giigs" click: attempt app open, fall back to the correct
  store after ~1s if nothing takes over. Works for 100% of visitors immediately,
  because it only needs the web + store links.

---

## 8. Universal Links / App Links  (FINAL PHASE — needs app release)

Chosen over a custom URI scheme: a custom scheme fails silently for our most
important visitor (app **not** installed); Universal/App Links degrade gracefully
because the `/events/{id}` page itself is the link.

Requires all of:
- **iOS:** host `/.well-known/apple-app-site-association` (website) + declare
  `associatedDomains: ["applinks:giigsapp.com"]` in the app.
- **Android:** host `/.well-known/assetlinks.json` (SHA256 of signing cert) +
  App Links intent filter.
- **App handler (new):** map `giigsapp.com/events/{external_id}` → discovery
  module → fetch show by `external_id` → open the event modal
  (`screens/playground/components/EventDetailSheet.jsx`) with the map
  (`PlaygroundScreen`) focused on `venue_lat/long`. Infra exists
  (`expo-linking` + notification deep-linking); the cold-start "open show by
  external_id + focus map" entry point is **new work**.

---

## 9. PostHog funnel

Full path, not just app opens (this is the acquisition-channel story for
investors): `event_link_viewed` → `tickets_clicked` / `share_clicked` →
`open_in_giigs_clicked` → `store_redirected` → `app_opened`.
- `event_link_viewed`…`store_redirected` are **web-side** (ship with §5–8).
- `app_opened` + install attribution need the app + deferred deep link → part of
  the FINAL phase.

---

## 10. Phasing (deliberately sequenced around the app release)

**Phase 1 — Backend:** ✅ DONE. `GET /api/public/shows/:externalId` + visibility gate + derived timezone. Verified via HTTP harness (200 / 404 / malformed-guard). _No app release._
**Phase 2 — Web page:** ✅ DONE. SSR `/events/[id]` (`src/lib/getShowByID.js`, `src/lib/formatShowDate.js`, `src/app/events/[id]/page.js` + `not-found.js`), 4 states. Verified end-to-end via `next start` → local router → real DB: upcoming/past/cancelled(noindex)/404 all correct, times render in venue-local zone. _No app release._
**Phase 3 — SEO:** ✅ DONE. OG/Twitter meta (hero photo when present, else on-brand generated image), dynamic 1200×630 OG image (`src/app/events/[id]/og/route.js`, edge, `#8338ec` + logo), JSON-LD `MusicEvent` (name/start/end/location+geo/performer/offers/eventStatus), and sitemap of eligible shows (`sitemap.js` ← new backend `GET /api/public/sitemap`). Verified live: OG route returns 1200×630 PNG, page emits JSON-LD + og:image. _No app release._
**Phase 4 — CTA + web funnel:** ✅ DONE. Device-detected "Open in Giigs" (iOS→App Store, Android→Play, desktop→both badges), Web Share button (Web Share API + clipboard fallback), tracked Tickets link, and the PostHog funnel (`event_link_viewed`/`tickets_clicked`/`share_clicked`/`open_in_giigs_clicked`/`store_redirected`) via `src/lib/analytics.js` (lazy posthog-js, no-ops until `NEXT_PUBLIC_POSTHOG_KEY` is set). Verified: renders + no hydration errors; build keeps posthog out of first-load JS. _No app release. → SHIPPABLE._
**Phase 5 — Deep linking (FINAL):** groundwork DONE; activates on the next app build.
  - ✅ **Website:** `public/.well-known/apple-app-site-association` (appID `RNJ66X94WK.com.brentpurks.Gigs`, paths `/events/*`) + `public/.well-known/assetlinks.json` (package `com.brentpurks.Gigs`) + `netlify.toml` content-type header for the extensionless AASA.
  - ✅ **App config (`app.json`):** iOS `associatedDomains: ["applinks:giigsapp.com"]`, Android App Links `intentFilters` (autoVerify, `https://giigsapp.com/events`).
  - ✅ **App routing (`RootApp.js`):** linking `Playground: "events/:deepLinkShowId"` (the `giigsapp.com` prefix already existed).
  - ✅ **App handler (`PlaygroundScreen.jsx`):** new effect fires `app_opened {source:"share_link"}` then hands off to the **existing** `openShowExternalId` opener (fetch show → open detail sheet). No new open-path built — reuses the notification deep-link machinery.
  - ⬜ **Android SHA-256:** replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256` in `assetlinks.json` with the **Play App Signing** cert SHA-256 (Play Console → App integrity → App signing key certificate).
  - ⬜ **Post-deploy verify:** `curl https://giigsapp.com/.well-known/apple-app-site-association` (application/json) and `/.well-known/assetlinks.json` resolve at the root.
  - ⬜ **Unify funnel (optional):** set the website `NEXT_PUBLIC_POSTHOG_KEY` to the app's project key (`phc_CXdhZVbAejKDEYeJJhpfmpnEBNcjiwN1p1qncMDV0uR`) so web `event_link_viewed → store_redirected` and app `app_opened` land in one funnel.
  ⚠️ Native entitlements only take effect in a **new app build** — which, per the branch situation below, also carries the platform-fee changes.

---

## 11. Release / branch note

Deep linking (Phase 5) is intentionally last because it's the only part needing an
**app release**. That release currently also carries the **platform-fee changes**:
the fee work landed on the same branch as the already-released calendar work by
accident, so the next app build ships fee + deep-link together. Sequence:
1. Ship Phases 1–4 (web + backend) independently — no app dependency.
2. Verify/deploy the platform-fee release (see `gigsBackend/plans/FEE_AND_PAYOUT_DEPLOY.md`).
3. Add the app deep-link handler on that same release, then flip on Phase 5.

---

## 12. Locked decisions & open items

**Locked (per review):**
- URL id = `external_id` (uuid) for v1; optional short slug later.
- Dynamic OG generator is also the missing-`hero_image_url` fallback.
- Website stays DB-free; data via backend `GET /api/public/shows/:externalId`.
- Universal Links / App Links (not custom scheme).
- Deep linking is the final phase, on the app/fee release.

**Open:**
- `confidence` threshold for `noindex` on low-quality ingests (pick a number).
- Whether to add a prettier short-slug column now or later.
- Install attribution mechanism (deferred deep link provider vs. PostHog-only).
