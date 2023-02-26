import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import useCrStore, { SpotifyUser } from "../store";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserStats from "../utils/requestUtils/getCurrentUserStats";
import { generateRandomColor } from "../utils";
import Link from "next/link";
const dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SpotifyUser>({});
  const loaderRef = useRef<any>(null);
  const {
    currentUser,
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  useEffect(() => {
    setIsLoading(true);
    loaderRef?.current?.continuousStart();
    if (currentUser.display_name) {
      setUser(currentUser);
      setIsLoading(false);
    }

    return () => {
      loaderRef?.current?.complete();
    };
  }, [currentUser]);

  let currentUserProfilePhotoURL = "";
  if (user.images) {
    currentUserProfilePhotoURL = user.images[0].url;
  }

  // get artists that the current user follows
  const followingRes = useQuery(["following", accessToken], () =>
    getCurrentUserStats(
      accessToken!,
      "following?type=artist",
      refreshToken!,
      setAccessTknData
    )
  );
  const followingTotal = followingRes?.data?.artists?.total;

  // get the current user's playlists
  const playlistsRes = useQuery(["playlists", accessToken], () =>
    getCurrentUserStats(
      accessToken!,
      "playlists",
      refreshToken!,
      setAccessTknData
    )
  );
  const playlistsTotal = playlistsRes?.data?.total;

  return (
    <main className="flex flex-col lg:flex-row gap-y-10 justify-center items-center h-full px-10 md:gap-x-28">
      {isLoading || followingRes.isLoading || playlistsRes.isLoading ? (
        <LoadingBar color="#33FF7A" ref={loaderRef} />
      ) : null}
      <section className="flex flex-col gap-y-10 md:max-w-lg">
        <div className="w-full h-[300px] md:h-[420px] relative bg-no-repeat bg-center bg-cover border-5 rounded-lg">
          <Image
            src={currentUserProfilePhotoURL}
            layout="fill"
            className="rounded-lg"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8N02kHgAGKwIZBBZ7nwAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="flex flex-col gap-y-2">
          {/* username */}
          <h1 className="text-5xl md:text-6xl font-extrabold">
            {user.display_name}
          </h1>
          {/* bio stats */}
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl">{user.followers?.total}</h4>{" "}
              <h4 className="text-1xl font-thin">followers</h4>
            </div>
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl">{followingTotal}</h4>{" "}
              <h4 className="text-1xl font-thin">following</h4>
            </div>
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl">{playlistsTotal}</h4>{" "}
              <h4 className="text-1xl font-thin">playlists</h4>
            </div>
          </div>
        </div>

        <button
          className="flex justify-center items-center py-5 gap-x-5 bg-cr-light-green rounded-md"
          onClick={() =>
            window.open(`${user?.external_urls?.spotify}`, "_ blank")
          }
        >
          <Image
            src="/icons/Spotify.png"
            height={30}
            width={30}
            alt="icon: cruunchify logo"
          />
          <small className="text-lg capitalize">Open In spotify</small>
        </button>
      </section>
      <section className="flex flex-col gap-y-5 md:max-w-lg">
        {/* explore */}
        <h2 className="hidden md:block text-6xl font-extrabold capitalize text-center">
          explore
        </h2>
        <div className="font-bold columns-1 md:columns-3 gap-3 w-screen px-5 md:px-0 md:w-full h-full">
          {/* top artists */}
          <Link href="/top/artists">
            <div
              className="w-full h-full aspect-video capitalize rounded-lg p-5 mb-5 cursor-pointer text-xl"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              top <br /> artists
            </div>
          </Link>
          {/* top tracks */}
          <Link href="/top/tracks">
            <div
              className="w-full h-full aspect-square capitalize rounded-lg p-5 text-xl cursor-pointer mb-3"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              top <br /> tracks
            </div>
          </Link>
          {/* top genres */}
          <Link href="/comingSoon">
            <div
              className="w-full aspect-video capitalize rounded-lg p-5 text-xl cursor-pointer mb-3"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              top <br /> genres
            </div>
            {/* top shows */}
          </Link>
          {/* @TODO: generate a recommended playlist */}
          <Link href="/comingSoon">
            <div
              className="w-full h-full aspect-square p-5 text-xl capitalize rounded-lg cursor-pointer mb-3 break-words"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              recommended <br /> playlist
            </div>
          </Link>
          <Link href="/top/shows">
            <div
              className="w-full h-full aspect-square p-5 text-xl capitalize rounded-lg cursor-pointer mb-3"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              top <br /> shows
            </div>
          </Link>
          {/* play highlights */}
          <Link href="/comingSoon">
            <div
              className="w-full aspect-video capitalize rounded-lg p-5 text-xl cursor-pointer mb-3"
              style={{
                backgroundColor: `${generateRandomColor()}`,
                backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
              }}
            >
              play highlights
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default dashboard;
