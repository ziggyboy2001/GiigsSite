"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { initAnalytics, capturePageview } from "../../../lib/analytics";

/**
 * Fires a `$pageview` on the initial load and on every App Router client-side
 * navigation. Split into its own component because useSearchParams() forces a
 * client bailout that must live under a <Suspense> boundary.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    capturePageview({ pathname, path: qs ? `${pathname}?${qs}` : pathname });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Root analytics island. Mounted once in the app layout: initialises posthog
 * (so autocapture starts immediately) and drives explicit pageview tracking.
 * Renders nothing.
 */
export default function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
