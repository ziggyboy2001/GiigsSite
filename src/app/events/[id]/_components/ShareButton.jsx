"use client";

import { useState } from "react";
import { ShareIcon } from "@heroicons/react/24/outline";

import { track } from "../../../../lib/analytics";

// Web Share API where available (mobile), clipboard-copy fallback (desktop).
export default function ShareButton({ showId, title, className = "" }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    track("share_clicked", { show_id: showId });
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // user dismissed the share sheet — ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Share this show"
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
