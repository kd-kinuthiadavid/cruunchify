import React from "react";
import Image from "next/image";
import Link from "next/link";
import useCrStore from "../store";

export default function Navbar() {
  const {
    accessTokenData: { accessToken },
  } = useCrStore();

  return (
    <nav className="mx-10 my-8 flex justify-center mb-16">
      {/* far left nav items */}
      <ul className="flex gap-x-5 items-center">
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
        <ul className="flex items-center gap-x-1 cursor-pointer">
          <li className="flex items-center">
            <Image
              src="/icons/About.png"
              height={30}
              width={30}
              alt="icon: about cruunchify"
            />
          </li>
          <li className="text-lg">About</li>
        </ul>
        {/* share */}
        <ul className="flex items-center gap-x-1 cursor-pointer">
          <li className="flex items-center">
            <Image
              src="/icons/Share.png"
              height={30}
              width={30}
              alt="icon: share cruunchify"
            />
          </li>
          <li className="text-lg">Share</li>
        </ul>
      </ul>
    </nav>
  );
}
