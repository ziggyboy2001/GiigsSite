"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2">
        <li>
          Venues and hosts make booking decisions backed by data ratings,
          reviews, and samples... not blind trust.
        </li>
        <li>
          Musicians can set clear rates, availability, and genres to attract the
          right clients.
        </li>
        <li>
          Both sides benefit from a streamlined, trustworthy ecosystem built for
          transparency and results.
        </li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <li>
          Musicians gain meaningful visibility through media-rich profiles,
          ratings, and reviews that prove their quality.
        </li>
        <li>
          Hosts discover talent matched to their needs with filters, search, and
          verified community feedback.{" "}
        </li>
        <li>
          Giigs amplifies credibility. Artists stand out not just by looks or
          luck, but by measurable reputation.
        </li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2">
        <li>
          Instant audio previews and real ratings let venues book with
          certainty, not guesswork.
        </li>
        <li>
          Clear communication tools ensure event details are finalized quickly
          and smoothly.
        </li>
        <li>
          From search to confirmation, every step is simple, reliable, and
          backed by proof of talent.
        </li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image
          src="/images/musicianProfile.png"
          alt="Giigs musician venue profile"
          width={300}
          height={300}
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">Giigs</h2>
          <p className="text-base lg:text-lg">
            Giigs is the data-driven live music marketplace that takes the
            guesswork out of booking musicians. Venues, event planners, and
            private hosts can discover and instantly book talent based on real
            profiles, verified ratings, and live audio samples... not hunches or
            guesswork. Musicians showcase their best work through professional
            profiles, while hosts use powerful search filters by genre,
            location, and reviews to make informed decisions. With instant
            booking, seamless communication, and transparent ratings, Giigs
            brings confidence and efficiency to the live music experience for
            both sides.
          </p>
          <div className="flex flex-row justify-start mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              {" "}
              Opportunity{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              {" "}
              Exposure{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              {" "}
              Ease of Use{" "}
            </TabButton>
          </div>
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
