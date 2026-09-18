"use client";

import { useRef, useState } from "react";

import { track } from "../../../../lib/analytics";

// Conditional "Listen" cascade (per product spec):
//   1. a real audio clip on the profile → ONE themed inline player
//   2. else a Spotify / Apple Music / YouTube link → single "Listen" button
//   3. else render nothing at all
export default function ListenSection({ artistSlug, audio = [], socials = {} }) {
  const first = Array.isArray(audio) && audio.length > 0 ? audio[0] : null;

  if (first) {
    return (
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight sm:text-2xl">
          Listen
        </h2>
        <ThemedPlayer artistSlug={artistSlug} src={first.url} title={first.title} />
      </section>
    );
  }

  const stream =
    (socials.spotify && { medium: "spotify", url: socials.spotify, label: "Listen on Spotify" }) ||
    (socials.appleMusic && { medium: "apple", url: socials.appleMusic, label: "Listen on Apple Music" }) ||
    (socials.youtube && { medium: "youtube", url: socials.youtube, label: "Watch on YouTube" }) ||
    null;

  if (!stream) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-extrabold tracking-tight sm:text-2xl">
        Listen
      </h2>
      <a
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track("artist_listen_played", { artist_slug: artistSlug, medium: stream.medium })
        }
        className="inline-flex items-center gap-2 rounded-full bg-[#8338ec] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8338ec]/25 transition hover:bg-[#9450f0]"
      >
        <PlayGlyph className="h-4 w-4" />
        {stream.label}
      </a>
    </section>
  );
}

function fmt(secs) {
  if (!Number.isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ThemedPlayer({ artistSlug, src, title }) {
  const ref = useRef(null);
  const played = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      if (!played.current) {
        played.current = true;
        track("artist_listen_played", { artist_slug: artistSlug, medium: "audio" });
      }
    } else {
      a.pause();
    }
  };

  const seek = (e) => {
    const a = ref.current;
    if (!a || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    a.currentTime = ratio * dur;
    setCur(a.currentTime);
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#8338ec]/15 to-white/[0.03] px-4 py-4 sm:px-5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#8338ec] text-white shadow-lg shadow-[#8338ec]/30 transition hover:bg-[#9450f0]"
      >
        {playing ? <PauseGlyph className="h-5 w-5" /> : <PlayGlyph className="h-5 w-5" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className="mb-2 truncate text-sm font-semibold text-white">
          {title || "Listen"}
        </p>
        <div
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          className="group relative h-2 w-full cursor-pointer rounded-full bg-white/15"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#a578f6]"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-medium tabular-nums text-white/50">
          <span>{fmt(cur)}</span>
          <span>{fmt(dur)}</span>
        </div>
      </div>

      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 0)}
        className="hidden"
      />
    </div>
  );
}

function PlayGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseGlyph({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
