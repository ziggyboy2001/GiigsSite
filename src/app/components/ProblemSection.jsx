import React from "react";
import Reveal from "./Reveal";

const ProblemSection = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="container relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            The city&apos;s most-asked question
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Nobody ever knew what was{" "}
            <span className="text-gradient">actually happening.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
            Scattered flyers. Dead Facebook events. Outdated venue calendars. A
            friend who might text back. The best live-music nights made discovery
            feel like a guessing game, and the show you would have loved was three
            blocks away the whole time. Giigs fixes that. It pulls every show into
            one live map with real set times, real venues, and real distances,
            updated the moment plans change so you always know what is happening
            right now.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default ProblemSection;
