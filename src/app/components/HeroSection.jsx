"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Welcome to{" "}
            </span>
            <br></br>
            <TypeAnimation
              sequence={["Opportunity", 1000, "Exposure", 1000, "Giigs.", 3000]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <p className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">
            Available now on the App Store and Google Play
          </p>
          <div>
            <Link
              href="https://apps.apple.com/us/app/giigs/id6467974842"
              className="inline-block w-full sm:w-fit mt-3 mx-2"
            >
              <div className="px-1 py-1 rounded bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white">
                <div className="bg-[#000000] hover:bg-slate-800 rounded flex justify-center items-center">
                  <Image
                    src="/images/appStore.png"
                    alt="App Store Giigs App"
                    width={200}
                    height={60} // Adjust the height as per your design needs
                    className="object-contain" // Ensure the image scales correctly within its container
                  />
                </div>
              </div>
            </Link>

            <Link
              href="https://play.google.com/store/apps/details?id=com.brentpurks.Gigs&pcampaignid=web_share"
              className="inline-block w-full sm:w-fit mt-3 mx-2"
            >
              <div className="px-1 py-1 rounded bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white ">
                <div className="bg-[#000000] hover:bg-slate-800 rounded flex justify-center items-center">
                  <Image
                    src="/images/googlePlay.png"
                    alt="google play giigs"
                    className="mx-0"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          <div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[440px] lg:h-[440px] relative">
            <Image
              src="/images/giigsVector.png"
              alt="giigs music booking mobile app"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              width={400}
              height={400}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
