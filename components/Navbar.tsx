import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useCrStore from "../store";

export default function Navbar() {
  const {
    accessTokenData: { accessToken },
  } = useCrStore();

  const navItemHover = {
    backgroundColor: "#3B3B40",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
  };

  return (
    <nav className="mx-10 my-8 flex justify-center mb-16">
      {/* far left nav items */}
      <motion.ul
        className="flex gap-x-10 items-center"
        transition={{ ease: "easeInOut" }}
      >
        {/* logo */}
        <Link href={accessToken ? "/dashboard" : "/"}>
          <ul className="flex items-center gap-x-3 cursor-pointer">
            <li className="flex items-center">
              <Image
                src="/icons/Logo.png"
                height={50}
                width={50}
                alt="icon: cruunchify logo"
              />
            </li>
          </ul>
        </Link>
        {/* about */}
        <motion.li className="text-lg cursor-pointer" whileHover={navItemHover}>
          About
        </motion.li>
        {/* share */}
        <motion.li className="text-lg cursor-pointer" whileHover={navItemHover}>
          Share
        </motion.li>
      </motion.ul>
    </nav>
  );
}
