"use client";

import { track, trackClick } from "../../../lib/analytics";

/**
 * Drop-in <button> that records the press before running its own onClick.
 *
 *   • Default: fires a clean, LABELLED `cta_clicked` event keyed by `label`.
 *   • Pass `event` to fire a specific funnel event instead.
 *
 *   <TrackedButton label="nav_menu_toggle" properties={{ state: "open" }} onClick={…} />
 */
export default function TrackedButton({
  label,
  event,
  properties = {},
  onClick,
  children,
  type = "button",
  ...rest
}) {
  const handleClick = (e) => {
    if (event) track(event, properties);
    else trackClick(label, properties);
    onClick?.(e);
  };

  return (
    <button type={type} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
