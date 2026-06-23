"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { APP_STORE_URL } from "./StoreBadges";

const navLinks = [
  { title: "Discover", path: "#discover" },
  { title: "How it works", path: "#how" },
  { title: "For venues", path: "#venues" },
  { title: "Download", path: "#download" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-5 py-3 lg:py-4">
        <Link href="/" aria-label="Giigs home" className="flex items-center">
          <Image
            src="/images/giigsVector916.png"
            alt="Giigs logo"
            width={92}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href={APP_STORE_URL}
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-600"
          >
            Get the app
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="rounded-lg border border-white/15 p-2 text-white md:hidden"
        >
          {open ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-white/10 md:hidden">
          <ul className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base text-white/80 hover:bg-white/5 hover:text-white"
                >
                  {link.title}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={APP_STORE_URL}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-brand-500 px-5 py-3 text-center text-base font-semibold text-white"
              >
                Get the app
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
