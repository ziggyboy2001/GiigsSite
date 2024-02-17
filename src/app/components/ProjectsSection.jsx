"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ProjectsSection = () => {
  return (
    <section
      id="projects"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        marginTop: 400,
        marginBottom: 400,
      }}
    >
      {/* <h2 style={{ marginBottom: "20px", fontWeight: "700", fontSize: 42 }}>
        Giigs
      </h2> */}
      <Image
        src="/images/giigsVector916.png"
        alt="giigs music booking app logo"
        className=""
        style={{ marginBottom: "20px" }}
        width={200}
        height={100}
      />
      <Image
        src="/images/giigSplash.png"
        alt="Giigs iOS Android Landing Splash Screen"
        width={500}
        height={500}
      />
      <p style={{ marginTop: "20px", fontWeight: "700", fontSize: 32 }}>
        Opportunity In Your Pocket.
      </p>
      <p style={{ marginTop: "24px", fontWeight: "500", fontSize: 32 }}>
        Download Giigs Today
      </p>
      <p style={{ marginTop: "4px", fontWeight: "500", fontSize: 32 }}>
        Available on iOS and Android
      </p>
      <Link
        href="https://apps.apple.com/us/app/giigs/id6467974842"
        className="inline-block w-full sm:w-fit mt-3 mx-2"
      >
        <div className="px-1 py-1 rounded bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white">
          <div className="bg-[#000000] rounded flex justify-center items-center">
            <Image
              src="/images/appStore.png"
              alt="App Store Giigs App Download giigs Today on Apple App Store"
              width={300}
              height={90}
              className="object-contain"
            />
          </div>
        </div>
      </Link>

      <Link
        href="https://play.google.com/store/apps/details?id=com.brentpurks.Gigs&pcampaignid=web_share"
        className="inline-block w-full sm:w-fit mt-3 mx-2"
      >
        <div className="px-1 py-1 rounded bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white ">
          <div className="bg-[#000000] rounded flex justify-center items-center">
            <Image
              src="/images/googlePlay.png"
              alt="google play giigs Download Giigs today on Google Play"
              className="mx-0"
              width={300}
              height={90}
            />
          </div>
        </div>
      </Link>
    </section>
  );
};

export default ProjectsSection;
