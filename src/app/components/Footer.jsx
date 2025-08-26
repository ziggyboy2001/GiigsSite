import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
      <div className="container p-12 flex justify-between items-center">
        <Image
          src="/images/giigsVector916.png"
          alt="giigs music booking app logo"
          className=""
          width={100}
          height={100}
        />
        <div className="flex flex-col items-end space-y-2">
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termsofservice"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
          <p className="text-slate-600 text-sm">
            2024 BCB Labs L.L.C All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
