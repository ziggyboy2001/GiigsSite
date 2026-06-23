import React from "react";
import Reveal from "./Reveal";

const stats = [
  { value: "100+", label: "shows mapped a night" },
  { value: "1 tap", label: "to find your night" },
  { value: "2", label: "cities live, more coming" },
  { value: "Real", label: "venues, real set times" },
];

const StatBand = () => {
  return (
    <section className="border-y border-white/10 bg-ink-900/60">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-5 py-12 md:grid-cols-4 lg:py-16">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-4xl font-extrabold text-white lg:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-white/55">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default StatBand;
