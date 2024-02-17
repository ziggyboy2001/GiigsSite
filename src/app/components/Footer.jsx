import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
      <div className="container p-12 flex justify-between">
        <Image
          src="/images/giigsVector916.png"
          alt="giigs music booking app logo"
          className=""
          width={100}
          height={100}
        />
        <p className="text-slate-600">
          2024 BCB Labs L.L.C All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
