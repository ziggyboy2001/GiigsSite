import React from "react";
import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL, PLAY_STORE_URL } from "./StoreBadges";

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
              The real-time map of live music near you. Find shows tonight, build
              bar crawls, and get tickets in a tap.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Product</span>
              <Link href="#discover" className="text-white/55 hover:text-white">
                Discover
              </Link>
              <Link href="#how" className="text-white/55 hover:text-white">
                How it works
              </Link>
              <Link href="#venues" className="text-white/55 hover:text-white">
                For venues
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Get the app</span>
              <Link href={APP_STORE_URL} className="text-white/55 hover:text-white">
                App Store
              </Link>
              <Link href={PLAY_STORE_URL} className="text-white/55 hover:text-white">
                Google Play
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white">Legal</span>
              <Link href="/privacy" className="text-white/55 hover:text-white">
                Privacy Policy
              </Link>
              <Link
                href="/termsofservice"
                className="text-white/55 hover:text-white"
              >
                Terms of Service
              </Link>
              <a
                href="mailto:cesar@getgiigs.com"
                className="text-white/55 hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-sm text-white/35">
          © 2023–{new Date().getFullYear()} BCB Labs L.L.C. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
