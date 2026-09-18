# Musician (Artist) Pages — Build Plan

Shareable public artist pages on the marketing site, mirroring the venue page
(`/events/venue/[venueId]` + `GET /api/public/venues/:venueId`). Works for
**platform** musicians (registered `musicians`) and **non‑platform** musicians
(name‑only, seen on external listings). Aggregates a musician's upcoming shows
from **on‑platform bookings** and **off‑platform listings**.

Route: **`/artists/[slug]`** · Backend: **`GET /api/public/musicians/:slug`**

---

## 1. Data model — how a musician links to shows

There is **no `artist_profile_id` on `shows`** — the only join is the name
(exactly like venues). Two feeds land in `shows`:

- **On‑platform booked gig** = a `posts` row with `chosen = musicianId`. The
  in‑app sync promotes it into `shows` with `artist_name` = the musician's
  `firstName + lastName` and it carries a guaranteed FK (`posts.chosen`).
  (In‑app `events` promote with `artist_name = NULL` → never tie to a musician.)
- **Off‑platform listing** = external `shows` (WWOZ/JamBase/etc.) with free‑text
  `artist_name`, usually a stage/band name.

So a musician's **name set** = `{ normalize(firstName+' '+lastName),
normalize(username) } ∪ aliases`, and we match `shows.artist_name` against it —
which unifies both feeds the same way the venue page unifies its two feeds.

### New tables (migration `062`)

`musician_aliases` — accepted name spellings/stage names per musician.
```
musician_aliases(
  id            bigserial pk,
  musician_id   integer NOT NULL REFERENCES musicians(id) ON DELETE CASCADE,
  alias         text NOT NULL,              -- raw display
  alias_norm    text NOT NULL,              -- normalize(alias), matched on
  created_by    integer REFERENCES users(id),
  created_at    timestamptz DEFAULT now(),
  UNIQUE(musician_id, alias_norm)
)
```

`musician_show_links` — the resolved link surface (validation lives here).
```
musician_show_links(
  id            bigserial pk,
  musician_id   integer NOT NULL REFERENCES musicians(id) ON DELETE CASCADE,
  show_id       bigint  NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  status        text NOT NULL,   -- 'auto' | 'confirmed' | 'pending' | 'rejected'
  confidence    numeric(4,3) NOT NULL DEFAULT 1.0,
  match_source  text NOT NULL,   -- 'in_app_booking'|'exact_name'|'alias'|'corroborated'|'fuzzy'
  details       jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE(musician_id, show_id)
)
```
Only `status IN ('auto','confirmed')` renders publicly. `pending` is parked
(safe default: never shows a wrong gig); `rejected` is a tombstone so the
matcher won't re‑add it.

> Migrations are applied to the **local** DB first and recorded in
> `schema_migrations`; prod is untouched until deploy.

---

## 2. Matcher service — `services/musicians/matchMusicianShows.js`

Populates `musician_show_links` for a musician (idempotent upsert). Tiers:

- **Tier 0 — guaranteed on‑platform** (`match_source='in_app_booking'`,
  status `confirmed`): for each `posts` row with `chosen = m.id`, isActive,
  upcoming, compute its `show_match_key` and link the matching `shows` row.
- **Tier 1 — exact name / alias** (`exact_name`/`alias`, status `auto`):
  `shows` where `normalize(artist_name)` ∈ name set. Covers most cases.
- **Tier 2 — corroborated** (`corroborated`, status `auto`): a weaker/short‑name
  match auto‑promotes **only if** a corroborating signal exists:
  show venue ∈ `musician_venue_bindings` for this musician, OR show city =
  musician city, OR the musician also has a confirmed booking at that venue.
- **Tier 3 — low confidence** (`fuzzy`, status `pending`): parked, not shown.

Validation path for `pending` (future, not v1 UI): alias add → promotes to
Tier 1; in‑app "Is this you?" confirm → `confirmed`; admin review dashboard.

Invocation (v1): a backfill script + refresh when a musician/show changes.
(Trigger wiring can be a fast follow; v1 ships a batch backfill.)

---

## 3. Backend endpoint — `GET /api/public/musicians/:slug`

Add to `api/publicShows.js` (or a sibling `api/publicMusicians.js` mounted at
`/api/public`). Mirrors the venue endpoint:

Resolution order:
1. `:slug` numeric → platform musician by `id`.
2. slug → platform musician by `normalize(username)` (then by
   `normalize(firstName+' '+lastName)`).
3. else → **non‑platform**: aggregate a header from external `shows` whose
   `normalize(artist_name)` = the slug (name, genres, city from snapshots).
   Renders even with zero shows.

Response `{ musician, shows }`:
- `musician`: `{ id, slug, source:'platform'|'external', name, genres, city,
  state, bio, imageUrl, socials:{spotify,instagram,tiktok,appleMusic,youtube,website},
  audio:[{title,url}], upcomingCount }` (external → most fields null).
- `shows`: upcoming public shows via `musician_show_links` (status auto/confirmed)
  for platform; via name match for external — reusing `serializeCard` +
  the same visibility gate (`deleted_at`/`merged_into_id`/status/`ends_at>=now()`).
- Cache: `s-maxage=300, stale-while-revalidate=86400`.

Musician media/socials come from: `musicians.spotify_url/instagram_url/tiktok_url`,
`musician_social_urls.social_data` (jsonb), and `links` (`profilePic`,
`userSong`/`audio` for the player, `urlOne..Five`/`userWebsite` for other links).

---

## 4. Frontend — `/artists/[slug]`

- `src/lib/getMusicianWithShows.js` — server fetch to
  `/api/public/musicians/:slug` (ISR `revalidate:300`), mirrors
  `getVenueWithShows.js`.
- `src/app/artists/[slug]/page.js` — server component:
  - `generateMetadata`: title/OG, JSON‑LD `MusicGroup`/`Person` +
    `ItemList` of upcoming `MusicEvent`s.
  - Co‑branded sticky nav (`[artist name] ✕ Giigs`), reusing venue‑page styling.
  - **Hero**: profile image, name, genres chips, city, upcoming count, CTAs.
  - **Listen** (conditional cascade):
    1. has `audio[]` → inline `<audio>` clips (the differentiator);
    2. else Spotify/Apple Music/YouTube link present → embed/link;
    3. else omit the section entirely.
  - **About**: bio + social links (only render present ones).
  - **Upcoming shows**: grouped by month, cards → `/events/:externalId`.
  - Non‑platform: name + genres + shows only (no bio/socials/audio, no claim CTA).
  - `_components/MusicianAnalytics.jsx` (client): `artist_page_viewed`.

CTAs follow the site convention: nav + cards use **"See What's Live →"**; the
"Find live music on Giigs" box keeps **"Get the app"**.

---

## 5. Analytics (add to `plans/ANALYTICS_EVENTS.md`)

- `artist_page_viewed` — `{ artist_slug, artist_name, platform:'platform'|'external', upcoming_count }`
- `artist_show_clicked` — `{ artist_slug, to_show_id, position }`
- `artist_listen_played` — `{ artist_slug, medium:'audio'|'spotify'|'apple'|'youtube' }`
- `artist_social_clicked` — `{ artist_slug, network }`
- Campaign attribution (venue/campaign/placement/utm) already global.

---

## 6. Robustness / edge cases

- Slug collisions (same name) → id‑based canonical slug + aliases.
- Inactive/private musicians (`isActive=false`) → 404 (same gate as shows).
- Wrong‑band external matches → Tier gating (pending never shows).
- Empty state renders (venue‑page lesson).
- Placeholder bios ("none"/"n/a") cleaned like `cleanDescription`.

---

## 7. Milestones

1. Migration `062` (local + `schema_migrations`).
2. Matcher service + backfill script; verify against a real platform musician.
3. Backend endpoint + serializer; verify platform + external via curl.
4. Frontend fetcher + page + components + analytics + JSON‑LD.
5. Verify end‑to‑end locally; document events; ship behind deploy.
