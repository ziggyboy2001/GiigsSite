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
          With Giigs you have direct access to hiring venues in your area.
        </li>
        <li>Know exactly what each venue is looking for and apply</li>
        <li>
          Be your own agent, gone are the days of paying someone to find shows
          for you.
        </li>
        <li>
          Stop playing in your parents basement, get noticed, get hired, get
          Giigs.
        </li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <li>Get out there and get noticed, to do that you must play live.</li>
        <li>
          With Giigs, booking live shows for you band has never been easier.
        </li>
        <li>
          With Giigs you can rapidly build your fanbase, and move up from small
          venues to large shows.
        </li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2">
        <li>Giigs is easy, there is no other way to slice it.</li>
        <li>Simply download Giigs, make an account and begin applying.</li>
        <li>Your profile is your resume.</li>
        <li>
          Add links to all of your music and socials, add images and videos of
          you playing live, music videos, or photo shoots to showcase your
          music.
        </li>
        <li>
          Once hired, you receive a QR code and confirmation. The venue will
          scan to check you in upon arrival to your show.
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
          width={500}
          height={500}
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">Giigs</h2>
          <p className="text-base lg:text-lg">
            Giigs, the revolutionary app designed to simplify the lives of
            musicians and venues alike. This groundbreaking platform serves as a
            nexus where talent and opportunity meet, streamlining the process of
            hiring or being hired. Musicians can effortlessly showcase their
            availability and open to work schedules, making it easier than ever
            for venues to find the perfect act for their next event. Giigs is
            more than just a booking app, it is a community. Whether you are a
            solo musician or a venue owner, Giigs offers a space where you can
            connect, collaborate, and create unforgettable experiences. With
            user-friendly features and a seamless interface, Giigs takes the
            hassle out of coordinating gigs, so you can focus on what really
            matters: the music. Say goodbye to endless emails and phone calls.
            With Giigs, your next performance is just a tap away. Get hired
            today, and take your band to the next level with Giigs.
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
