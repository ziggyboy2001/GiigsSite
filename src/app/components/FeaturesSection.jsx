import React from "react";
import PhoneFrame from "./PhoneFrame";
import Reveal from "./Reveal";

const features = [
  {
    eyebrow: "Discovery feed",
    title: "Tonight, this week, Rock, Pop, all in one feed.",
    body: "Open Giigs and the whole scene is already organized for you. Curated rails group shows by genre and vibe, every artist carries a real rating, and a search bar plus genre chips let you jump straight to the sound you want. No stale listings, no dead links, no guessing where the night is.",
    bullets: [
      "Curated rails by genre, mood, and what is new",
      "Search by artist or genre with one-tap filters",
      "Real ratings and photos on every artist",
      "Sort by distance so the closest shows come first",
    ],
    img: "/images/discovery/feed-live.png",
    alt: "Giigs discovery feed with Live Now, Tonight, This Week and genre rails",
    glow: "brand",
  },
  {
    eyebrow: "Live map",
    title: "The whole city's nightlife, live on one map.",
    body: "Every show around you appears as a pin. Orange pins are happening live this second, blue pins are coming up. Switch between All, Live Now, Tonight, Tomorrow, and Week to reshape the map instantly, then tap any pin to see who is on, the set time, the cover charge, and how far away it is.",
    bullets: [
      "See what is playing live this second in orange",
      "Filter the map: All, Live Now, Tonight, Tomorrow, Week",
      "Tap a pin for set time, cover, and distance",
      "Counts like 50 of 100 gigs tonight at a glance",
    ],
    img: "/images/discovery/map-live.png",
    alt: "Giigs live map of shows across the French Quarter",
    glow: "live",
  },
  {
    eyebrow: "Show details and tickets",
    title: "Tap a show. Get directions or tickets.",
    body: "Everything you need to commit to a night lives in one sheet. See the band, the venue, the date and set time, the cover, and the exact distance, then choose what happens next. Get directions, save the gig, check in, invite friends, or buy tickets without ever leaving Giigs. A More like this row keeps the night going.",
    bullets: [
      "Set time, cover charge, and distance up front",
      "Get directions, save a gig, or check in",
      "Get tickets in a tap",
      "More like this surfaces similar shows nearby",
    ],
    img: "/images/discovery/event-detail.png",
    alt: "Giigs show detail with get directions, save, check in and get tickets",
    glow: "brand",
  },
  {
    eyebrow: "Bar crawl",
    title: "A full night, planned stop by stop.",
    body: "Tell Giigs the vibe and it builds the route. A bar crawl strings together several live shows in one night with the order of stops, turn-by-turn walking directions, the walk time between each venue, and perks waiting along the way. A live pin keeps you on pace so you never miss the next set.",
    bullets: [
      "Multi-stop routes between real live shows",
      "Turn-by-turn walking directions and walk times",
      "Perks waiting at every stop",
      "A live pin so you always catch the next set",
    ],
    img: "/images/discovery/crawl-live.png",
    alt: "Giigs bar crawl route with stops, walk times and turn-by-turn directions",
    glow: "brand",
  },
  {
    eyebrow: "Check in and perks",
    title: "Check in. Redeem. Happy hour all night.",
    body: "Show Giigs when you walk in and your perks follow you through the night, including happy-hour pricing at the bar. The Discover menu keeps bar crawls, perks, and check-ins one tap away, while your Library holds saved shows and history, and Friends lets you invite the crew and roll out together.",
    bullets: [
      "Redeem happy-hour pricing and perks at the bar",
      "Saved shows and full history in your Library",
      "Invite friends and head out together",
      "Alerts so you never miss a favorite artist",
    ],
    img: "/images/discovery/menu-discover.png",
    alt: "Giigs discover menu with bar crawl, perks, check in and saved shows",
    glow: "live",
  },
];

const FeaturesSection = () => {
  return (
    <section id="discover" className="py-20 lg:py-28">
      <span id="how" className="relative -top-24 block" aria-hidden />
      <div className="container mx-auto px-5">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            How Giigs works
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            The whole night, in your pocket.
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Map, discovery, bar crawls, check-ins, and show details. These are
            real screens from the app, not a render.
          </p>
        </Reveal>

        <div className="space-y-24 lg:space-y-32">
          {features.map((f, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={f.eyebrow}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal
                  className={reversed ? "lg:order-2" : ""}
                  y={32}
                >
                  <div className="flex justify-center">
                    <PhoneFrame src={f.img} alt={f.alt} glow={f.glow} />
                  </div>
                </Reveal>

                <Reveal
                  delay={0.1}
                  className={reversed ? "lg:order-1" : ""}
                >
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
                    {f.eyebrow}
                  </p>
                  <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-white/65">
                    {f.body}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-3 w-3"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-white/75">{b}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
