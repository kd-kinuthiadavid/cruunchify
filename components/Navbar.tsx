import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useCrStore from "../store";
import CrPopover from "./CrPopover";

export default function Navbar() {
  // component state
  const [currentUserHref, setCurrentUserHref] = useState("");
  const [hasCurrentUser, setHasCurrentUser] = useState(false);
  const [urlCopySuccess, setUrlCopySuccess] = useState(false);

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

  function handleCopyToClipboard() {
    navigator.clipboard.writeText("https://cruunchify.vercel.app/").then(
      () => {
        setUrlCopySuccess(true);
      },
      () => {
        console.error("Something went wrong copying link");
      }
    );
  }

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
        <CrPopover btnText="About">
          <div className="flex flex-col gap-y-3">
            <h5 className="text-xl font-black">About The App</h5>
            <p className="font-light">
              Cruunchify is a sptofiy highlights app that allows users to
              explore their listening patterns. In other words, it's an
              on-demand 'spotify wrapped' app.
            </p>
            <div
              className="flex mt-3 w-full items-center gap-x-5 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://github.com/kd-kinuthiadavid/cruunchify",
                  "_blank"
                )
              }
            >
              <i className="text-3xl fa-brands fa-github"></i>
              <p className="text-medium">Explore on Github</p>
            </div>
          </div>
        </CrPopover>
        {/* share */}
        <CrPopover btnText="Share">
          <div className="flex flex-col gap-y-3">
            <h5 className="text-xl font-black">Share</h5>
            <p className="font-light">Share with friends and family.</p>
            <div className="flex gap-x-5 flex-wrap">
              {/* twitter */}
              <a
                className="twitter-share-button"
                href="https://twitter.com/intent/tweet?text=Explore%20how%20you%20listen%20to%20music%20on%20Spotify%20with%20Cruunchify:%0A&url=https://cruunchify.vercel.app%0A%0A&hashtags=SpotifyAPI,spotify,cruunchify,tech,web,SpotifyWrapped"
                target="_blank"
              >
                <i className="text-2xl text-[#00acee] fa-brands fa-twitter"></i>
              </a>
              {/* facebook */}
              <a
                className="fb-xfbml-parse-ignore"
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcruunchify.vercel.app%2F&amp;src=sdkpreparse"
                target="_blank"
              >
                <i className="text-2xl fa-brands fa-facebook text-white"></i>
              </a>
              {/* copy to clipboard */}
              {urlCopySuccess ? (
                <small className="text-cr-green">copied !</small>
              ) : (
                <i
                  className="text-2xl text-cr-light-green fa-solid fa-copy cursor-pointer"
                  onClick={handleCopyToClipboard}
                ></i>
              )}
            </div>
          </div>
        </CrPopover>
      </motion.ul>
      {hasCurrentUser ? (
        <div className="flex items-center gap-x-5">
          <p className="hidden font-medium md:block">
            {currentUser?.display_name}
          </p>
          <Image
            src={currentUserHref}
            className="rounded-full cursor-pointer"
            height={50}
            width={50}
            alt="icon: cruunchify logo"
          />
        </div>
      ) : null}
    </nav>
  );
}
