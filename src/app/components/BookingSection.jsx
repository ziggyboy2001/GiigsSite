import React from "react";
import PhoneFrame from "./PhoneFrame";
import Reveal from "./Reveal";

const points = [
  {
    title: "Book with proof, not hunches",
    body: "Every artist has a verified profile with a Giigs Rating, reviews, photos, and live audio and video, so you know exactly what you are getting before you commit.",
  },
  {
    title: "Data on every artist",
    body: "Average draw, confidence score, expected sales, expected crowd, crowd response, and genre match give you the numbers behind the booking, not just a highlight reel.",
  },
  {
    title: "Any event, booked in-app",
    body: "Set the event type, whether live music, a private event, corporate, a wedding, or a meeting, fill in the details and date, then book the artist directly inside Giigs.",
  },
  {
    title: "Artists win gigs on merit",
    body: "Musicians build a media-rich profile with their rates, genres, and availability, then get discovered and booked based on real reputation instead of luck.",
  },
];

const BookingSection = () => {
  return (
    <section id="venues" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-brand-glow opacity-60" />
      <div className="container relative mx-auto grid grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            For venues, planners &amp; musicians
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            The data-driven way to book live music.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/65">
            Beyond discovery, Giigs is a full booking marketplace. Venues, event
            planners, and private hosts discover and book musicians from verified
            profiles backed by real data, while artists showcase their best work
            and win gigs on merit. It is the same trusted ecosystem powering the
            shows you find on the map.
          </p>

          <div className="mt-8 space-y-6">
            {points.map((p) => (
              <div key={p.title} className="border-l-2 border-brand-500/40 pl-5">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="relative flex items-center justify-center">
            <div className="hidden sm:block sm:translate-x-10 sm:translate-y-6 sm:opacity-80">
              <PhoneFrame
                src="/images/discovery/artist-stats.png"
                alt="Giigs artist stats with Giigs Rating, expected sales and crowd"
                glow="none"
                className="!w-[220px]"
              />
            </div>
            <div className="relative z-10 sm:-translate-x-10">
              <PhoneFrame
                src="/images/discovery/booking-sheet.png"
                alt="Giigs booking sheet to book a musician for an event"
                glow="brand"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default BookingSection;
