import React from "react";
import Image from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL } from "./StoreBadges";
import TrackedLink from "./analytics/TrackedLink";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="container mx-auto px-5 py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left">
            <Image
              src="/images/giigsVector916.png"
              alt="Giigs logo"
              width={100}
              height={44}
              className="mx-auto h-10 w-auto object-contain md:mx-0"
            />
            <p className="mt-4 max-w-xs text-sm text-white/45">
              The real-time map of live music near you. Find shows tonight,
              build bar crawls, and get tickets in a tap.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Product</span>
              <TrackedLink
                href="#discover"
                label="footer_discover"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                Discover
              </TrackedLink>
              <TrackedLink
                href="#how"
                label="footer_how_it_works"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                How it works
              </TrackedLink>
              <TrackedLink
                href="#venues"
                label="footer_for_venues"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                For venues
              </TrackedLink>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Get the app</span>
              <TrackedLink
                href={APP_STORE_URL}
                label="footer_app_store"
                properties={{ location: "footer", store: "ios" }}
                className="text-white/55 hover:text-white"
              >
                App Store
              </TrackedLink>
              <TrackedLink
                href={PLAY_STORE_URL}
                label="footer_play_store"
                properties={{ location: "footer", store: "android" }}
                className="text-white/55 hover:text-white"
              >
                Google Play
              </TrackedLink>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Legal</span>
              <TrackedLink
                href="/privacy"
                label="footer_privacy"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                Privacy Policy
              </TrackedLink>
              <TrackedLink
                href="/termsofservice"
                label="footer_terms"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                Terms of Service
              </TrackedLink>
              <TrackedLink
                href="mailto:cesar@getgiigs.com"
                label="footer_contact"
                properties={{ location: "footer" }}
                className="text-white/55 hover:text-white"
              >
                Contact
              </TrackedLink>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-sm text-white/35">
          © 2023–{new Date().getFullYear()} Giigs Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
