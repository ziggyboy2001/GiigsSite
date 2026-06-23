import React from "react";

const venues = [
  "Snug Harbor",
  "Tipitina's",
  "Spotted Cat",
  "Chickie Wah Wah",
  "The Maison",
  "d.b.a.",
  "Blue Nile",
  "Café Negril",
  "Mahogany Jazz Hall",
  "Saturn Bar",
];

const VenueMarquee = () => {
  const row = [...venues, ...venues];
  return (
    <section className="border-y border-white/10 bg-ink-900/40 py-8">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
        Real venues. Real shows. Updated in real time.
      </p>
      <div className="relative overflow-hidden">
        <div className="marquee-track gap-10 pr-10">
          {row.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="whitespace-nowrap font-display text-2xl font-bold text-white/30"
            >
              {v}
              <span className="ml-10 text-brand-500/50">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenueMarquee;
