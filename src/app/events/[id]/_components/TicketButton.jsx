"use client";

import { track } from "../../../../lib/analytics";

// Tickets link with funnel tracking. Behaves like a normal external anchor.
export default function TicketButton({ showId, url, label, className = "" }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("tickets_clicked", { show_id: showId })}
      className={className}
    >
      {label}
    </a>
  );
}
