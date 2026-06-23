"use client";
import React from "react";
import { motion } from "framer-motion";
import PhoneFrame from "./PhoneFrame";
import StoreBadges from "./StoreBadges";

const chips = ["Live Now", "Tonight", "Tomorrow", "This Week", "By genre"];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow + grid */}
      <div className="pointer-events-none absolute inset-0 bg-brand-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-5 pb-16 pt-32 lg:grid-cols-2 lg:pb-24 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-live-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live-500" />
            </span>
            Live now in New Orleans &amp; Atlanta
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where&apos;s the <span className="text-gradient">live music</span>{" "}
            tonight?
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65 lg:mx-0">
            Giigs is the real-time map of every live show happening around you.
            See who is playing right now, browse what is on later tonight or all
            week, and filter by genre and distance. Tap any pin for the set time,
            cover, and how far away it is, then get walking directions, build a
            bar crawl, or grab tickets in a single tap.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
            {chips.map((c, i) => (
              <span
                key={c}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                  i === 0
                    ? "border-live-500/40 bg-live-500/15 text-live-400"
                    : "border-white/10 bg-white/5 text-white/70"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          <StoreBadges className="mt-8 justify-center lg:justify-start" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="animate-float">
            <PhoneFrame
              src="/images/discovery/map-livenow.png"
              alt="Giigs live map showing shows happening live right now"
              glow="brand"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
