import React from "react";
import Image from "next/image";
import StoreBadges from "./StoreBadges";
import Reveal from "./Reveal";

const DownloadSection = () => {
  return (
    <section id="download" className="px-5 py-24 lg:py-32">
      <Reveal className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-850 px-6 py-16 text-center shadow-card sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-brand-glow" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative mx-auto max-w-2xl">
            <Image
              src="/images/giigsVector916.png"
              alt="Giigs logo"
              width={140}
              height={60}
              className="mx-auto mb-8 h-14 w-auto object-contain"
            />
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Find the live music. <span className="text-gradient">Tonight.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
              Download Giigs free and never miss what is happening around you
              again. Open the live map, find a show, plan the crawl, and head out,
              all in a couple of taps. Available now on iOS and Android, live in
              New Orleans and Atlanta with more cities on the way.
            </p>

            <div className="mt-9 flex flex-col items-center gap-8">
              <StoreBadges className="justify-center" size={200} />
              <Image
                src="/images/giigsQRCode.png"
                alt="Scan to download Giigs"
                width={132}
                height={132}
                className="h-32 w-32 rounded-2xl border border-white/10 bg-white p-2"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default DownloadSection;
