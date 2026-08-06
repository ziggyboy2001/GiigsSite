/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import StoreBadges from "../../components/StoreBadges";

export const metadata = {
  title: "Show not found",
  robots: { index: false, follow: true },
};

export default function EventNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-6 text-center text-white">
      <img
        src="/images/giigsVector.png"
        alt="Giigs"
        className="h-16 w-auto drop-shadow-lg"
      />
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
        This show isn&apos;t available
      </h1>
      <p className="mt-3 max-w-md text-[#ADB7BE]">
        It may have been removed, or the link is incorrect. Discover live music
        happening near you on Giigs.
      </p>
      <div className="mt-6">
        <StoreBadges size={160} />
      </div>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-[#a578f6] hover:text-[#c4a4fa]"
      >
        ← Back to Giigs
      </Link>
    </main>
  );
}
