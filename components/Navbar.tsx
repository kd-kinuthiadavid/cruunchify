import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useCrStore from "../store";

export default function Navbar() {
  // component state
  const [currentUserHref, setCurrentUserHref] = useState("");
  const [hasCurrentUser, setHasCurrentUser] = useState(false);

  // hooks
  const {
    accessTokenData: { accessToken },
    currentUser,
  } = useCrStore();

  // effects
  useEffect(() => {
    if (currentUser) {
      const href: string = currentUser?.images![0]?.url;
      setCurrentUserHref(href);
      setHasCurrentUser(true);
    }
  }, [currentUser]);

  const navItemHover = {
    backgroundColor: "#3B3B40",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
  };

  return (
    <nav
      className={`mx-2 md:mx-10 my-8 flex ${
        hasCurrentUser ? "justify-between" : "justify-center"
      } mb-16`}
    >
      {/* far left nav items */}
      <motion.ul className="flex gap-x-3 md:gap-x-10 items-center">
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
      {hasCurrentUser ? (
        <Image
          src={currentUserHref}
          className="rounded-full"
          height={50}
          width={50}
          alt="icon: cruunchify logo"
        />
      ) : null}
    </nav>
  );
}
