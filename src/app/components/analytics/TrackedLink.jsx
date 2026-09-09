"use client";

import Link from "next/link";

import { track, trackClick } from "../../../lib/analytics";

/**
 * Drop-in replacement for next/link that records the press before navigating.
 *
 *   • Default: fires a clean, LABELLED `cta_clicked` event keyed by `label`.
 *       <TrackedLink href={URL} label="app_store_badge" properties={{ location }}>
 *   • Pass `event` to fire a specific funnel event instead (matches the
 *     tickets_clicked / share_clicked convention):
 *       <TrackedLink href={dir} event="directions_clicked" properties={{ show_id }}>
 *
 * mailto:/tel: hrefs render a plain <a> (next/link warns on non-navigational
 * schemes); everything else uses next/link so internal routing is preserved.
 * Any onClick passed in still runs after the event is recorded.
 */
export default function TrackedLink({
  href,
  label,
  event,
  properties = {},
  onClick,
  children,
  ...rest
}) {
  const handleClick = (e) => {
    if (event) track(event, { href, ...properties });
    else trackClick(label, { href, ...properties });
    onClick?.(e);
  };

  const isNonNav = typeof href === "string" && /^(mailto:|tel:)/i.test(href);

  if (isNonNav) {
    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
