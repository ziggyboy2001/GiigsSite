# Giigs Website — PostHog Analytics

Reference for every analytics trigger on the Giigs marketing site + public
event pages. Share-ready for the team.

- **Tool:** PostHog (`posthog-js`), host `https://us.i.posthog.com`
- **Key:** `NEXT_PUBLIC_POSTHOG_KEY` (set in `.env.local`; must also be set in
  the production / Netlify environment for live data)
- **Code:** `src/lib/analytics.js` (wrapper) +
  `src/app/components/analytics/` (`AnalyticsProvider`, `TrackedLink`,
  `TrackedButton`)

---

## ⚠️ Website identifier (read this first)

The website and the **mobile app share the same PostHog project**, so events are
mixed together. Every event fired from the website is stamped with persistent
super-properties so you can isolate web traffic:

| Property | Value |
| --- | --- |
| `app` | `giigs-website` |
| `platform` | `web` |

**To find website-only data in PostHog:** add a filter `app = giigs-website`
(or `platform = web`) to any insight, event, or dashboard. This applies to
**all** events below — including the pre-existing event-page triggers and
PostHog's built-in `$pageview` / `$autocapture` — because super-properties ride
along on everything.

> Tip: save an Insight filtered to `app = giigs-website` as the starting point
> for a "Giigs Website" dashboard.

---

## 📍 Campaign / QR attribution

Tag any inbound link or QR poster with query params and they attach to that
visitor's **entire session** automatically (registered as super-properties).

**Supported params** (read from the landing URL): `venue`, `campaign`,
`placement`, `source`, `medium`, and standard `utm_*`
(`utm_source` / `utm_medium` / `utm_campaign` / `utm_content` / `utm_term`).

### Marigny Opera House QR — use exactly this URL

The QR points at the **venue landing page** (`/events/venue/<venueId>`), which
lists all of the venue's upcoming shows and never goes stale — so the same
printed poster keeps working after any single show has passed. The page renders
whether or not the venue currently has shows.

Marigny Opera House is a **platform venue** (`venue_profiles.id = 147`), so use
its id (its name slug `marigny-opera-house` also resolves):

```
https://giigsapp.com/events/venue/147?venue=marigny_opera_house&campaign=moh_launch_sep_2026&placement=poster
```

> The endpoint resolves a venue from **either** the `venue_profiles` table
> (platform venues — by numeric id or name slug) **or** the `shows` table
> (non-platform / externally-ingested venues — by name slug), and lists their
> upcoming shows from `shows` (already the deduped union of in-app events +
> external listings). Confirm a venue via `GET /api/public/venues/147`.

Every event from that visitor then carries:

| Property | Value |
| --- | --- |
| `venue` | `marigny_opera_house` |
| `campaign` | `moh_launch_sep_2026` |
| `placement` | `poster` |

And on arrival we fire one explicit entry event:

| Event | Fires when | Properties |
| --- | --- | --- |
| `campaign_landing` | Visitor lands on a tagged URL | whichever campaign params were present |

### The Saturday funnel — filter everything by `campaign = moh_launch_sep_2026`

```
campaign_landing        →  came from the Marigny QR
venue_page_viewed       →  landed on the Marigny venue page
venue_show_clicked      →  picked a show
event_link_viewed       →  viewed the event
related_show_clicked    →  explored another show
tickets_clicked         →  clicked tickets
get_app_clicked /
open_in_giigs_clicked   →  tried to get / open the app
```

Because the params persist as super-properties, they stay attached as the
visitor browses to other shows in the same session, so the funnel holds even
though those later URLs don't carry the params.

> Note: super-properties persist in the browser, so a visitor stays tagged with
> the last campaign they arrived from until they arrive via a new one. For a
> launch-day count that's exactly what you want — just scope insights to the
> campaign window (e.g. Sep 2026) so you don't count stragglers weeks later.

---

## 1. Automatic / infrastructure

| Event | Fires when | Notes |
| --- | --- | --- |
| `$pageview` | Every load **and** client-side route change | Fired explicitly from `AnalyticsProvider`; props include `pathname`, `path` |
| `$pageleave` | User leaves a page | Dwell-time / bounce |
| `$autocapture` | Any click / rageclick | Broad coverage beneath the explicit events below |

---

## 2. Labelled CTA clicks — `cta_clicked`

All of these fire a single event named **`cta_clicked`** with a human-readable
`label` property (plus the extras noted). In PostHog, break down `cta_clicked`
by `label` to see every button/link, or filter `label = <value>`.

### Marketing site

| `label` | Location | Extra properties |
| --- | --- | --- |
| `app_store_badge` | Every App Store badge | `location` (hero / download / footer / event_open_in_giigs), `store: ios` |
| `play_store_badge` | Every Play Store badge | `location`, `store: android` |
| `nav_logo` | Navbar logo | — |
| `nav_discover` | Navbar link | `location` (navbar / mobile_menu), `title` |
| `nav_how_it_works` | Navbar link | `location`, `title` |
| `nav_for_venues` | Navbar link | `location`, `title` |
| `nav_download` | Navbar link | `location`, `title` |
| `nav_get_app` | Navbar "Get the app" | `location`, `store: ios` |
| `nav_menu_toggle` | Mobile menu button | `action` (open / close) |
| `footer_discover` | Footer product link | `location: footer` |
| `footer_how_it_works` | Footer product link | `location: footer` |
| `footer_for_venues` | Footer product link | `location: footer` |
| `footer_app_store` | Footer store link | `store: ios` |
| `footer_play_store` | Footer store link | `store: android` |
| `footer_privacy` | Footer legal link | `location: footer` |
| `footer_terms` | Footer legal link | `location: footer` |
| `footer_contact` | Footer contact (mailto) | `location: footer` |

### Public event page (`/events/[id]`)

| `label` | Location | Extra properties |
| --- | --- | --- |
| `event_header_logo` | Event header logo | `show_id` |
| `event_cta_logo` | Bottom CTA logo | `show_id`, `location: event_cta` |
| `event_footer_privacy` | Event footer link | `show_id` |
| `event_footer_terms` | Event footer link | `show_id` |

### Venue landing page (`/events/venue/[slug]`)

| `label` | Location | Extra properties |
| --- | --- | --- |
| `venue_header_logo` | Venue header logo | `venue_id` |
| `venue_cta_logo` | Bottom CTA logo | `venue_id` |
| `venue_footer_privacy` | Venue footer link | `venue_id` |
| `venue_footer_terms` | Venue footer link | `venue_id` |

---

## 3. Event-page funnel events (named)

Specific events (not `cta_clicked`) that match the existing funnel naming.

| Event | Fires when | Properties |
| --- | --- | --- |
| `directions_clicked` | "Get directions →" tapped | `show_id` (event) or `venue_id` (venue page), `has_coords` |
| `related_show_clicked` | A related-show rail card tapped | `from_show_id`, `to_show_id`, `rail` (artist / similar), `position`, `artist` |
| `get_app_clicked` | Event/venue "Get the app" | `show_id` or `venue_id`, `location` (event_header / venue_header / venue_cta / venue_empty_state) |

### Venue landing page (`/events/venue/[slug]`)

| Event | Fires when | Properties |
| --- | --- | --- |
| `venue_page_viewed` | Venue landing page viewed (top of venue funnel) | `venue_id`, `venue_name`, `upcoming_count` |
| `venue_show_clicked` | An upcoming-show card tapped → goes to `/events/[id]` | `venue_id`, `to_show_id`, `position`, `artist` |

---

## 4. Pre-existing event-page triggers (unchanged)

These already existed; documented here for completeness. They now also carry the
`app = giigs-website` / `platform = web` identifier automatically.

| Event | Fires when | Properties |
| --- | --- | --- |
| `event_link_viewed` | Event page viewed (top of funnel) | `show_id`, `state` |
| `tickets_clicked` | "Get tickets" tapped | `show_id` |
| `share_clicked` | Share button tapped | `show_id` |
| `open_in_giigs_clicked` | "Open in Giigs" / store badge tapped | `show_id`, `platform`, sometimes `mode: deep_link` |
| `store_redirected` | Redirected to App Store / Play Store | `show_id`, `store` |
| `in_app_browser_detected` | Page opened in an in-app browser | `app` |
| `in_app_browser_escape_attempt` | "Open in browser" tapped | `app`, `platform` |
| `in_app_browser_link_copied` | "Copy link" tapped | `app` |

---

## Suggested funnel (event page)

```
event_link_viewed
  → directions_clicked
  → tickets_clicked
  → share_clicked
  → related_show_clicked
  → get_app_clicked / open_in_giigs_clicked
    → store_redirected
```

Filter the whole thing by `app = giigs-website` to keep it web-only.

---

## Adding new triggers

- **Link CTA:** use `TrackedLink` — `label` for a generic `cta_clicked`, or
  `event` for a named funnel event.
  ```jsx
  <TrackedLink href={URL} label="hero_secondary_cta" properties={{ location: "hero" }}>…</TrackedLink>
  <TrackedLink href={dir} event="directions_clicked" properties={{ show_id }}>…</TrackedLink>
  ```
- **Button / action:** use `TrackedButton` the same way.
- **Anything custom:** call `track("my_event", { ... })` or
  `trackClick("my_label", { ... })` from `src/lib/analytics.js`.

All helpers no-op safely when `NEXT_PUBLIC_POSTHOG_KEY` is absent.
