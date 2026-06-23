import React from "react";
import Image from "next/image";

/**
 * PhoneFrame: drops a full-screen app screenshot into a realistic iPhone shell.
 *
 * Usage:
 *   <PhoneFrame src="/images/discovery/map-livenow.png" alt="Giigs live map" />
 *
 * To swap in a new simulator screenshot, just point `src` at the new file in
 * /public/images/discovery. Screenshots should be full-device portrait captures.
 */
const PhoneFrame = ({
  src,
  alt,
  priority = false,
  glow = "brand", // "brand" | "live" | "none"
  className = "",
}) => {
  const glowClass =
    glow === "live"
      ? "shadow-glow-live"
      : glow === "brand"
      ? "shadow-glow"
      : "";

  return (
    <div
      className={`relative mx-auto w-[260px] sm:w-[300px] ${className}`}
    >
      <div
        className={`relative rounded-[3rem] border border-white/15 bg-ink-950 p-2.5 shadow-card ${glowClass}`}
      >
        {/* dynamic island */}
        <div className="absolute left-1/2 top-4 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.3rem] bg-black">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 260px, 300px"
              className="object-cover object-top"
            />
          ) : (
            <ScreenshotPlaceholder label={alt} />
          )}
        </div>
      </div>
    </div>
  );
};

/** Labeled placeholder for when a screenshot slot is empty. */
export const ScreenshotPlaceholder = ({ label = "Screenshot" }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-grid bg-ink-900 p-6 text-center">
    <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">
      Screenshot slot
    </span>
    <span className="text-sm text-white/50">{label}</span>
  </div>
);

export default PhoneFrame;
