import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import useCrStore, { SpotifyUser } from "../store";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserStats from "../utils/requestUtils/getCurrentUserStats";
import { generateRandomColor } from "../utils";
const dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SpotifyUser>({});
  const loaderRef = useRef<any>(null);
  const {
    currentUser,
    accessTokenData: { accessToken },
  } = useCrStore();
  const router = useRouter();

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
    getCurrentUserStats(accessToken!, "following?type=artist")
  );
  const followingTotal = followingRes?.data?.artists?.total;

  // get the current user's playlists
  const playlistsRes = useQuery(["playlists", accessToken], () =>
    getCurrentUserStats(accessToken!, "playlists")
  );
  const playlistsTotal = playlistsRes?.data?.total;

  return (
    <main className="flex flex-col lg:flex-row gap-y-10 justify-center items-center h-full px-10 md:gap-x-28">
      {isLoading || followingRes.isLoading || playlistsRes.isLoading ? (
        <LoadingBar color="#33FF7A" ref={loaderRef} />
      ) : null}
      <section className="flex flex-col gap-y-10 md:max-w-lg">
        <div
          className="w-full h-[300px] md:h-[420px] bg-no-repeat bg-center bg-cover border-5 border-red-500 rounded-lg"
          style={{
            backgroundImage: `url(${currentUserProfilePhotoURL})`,
          }}
        ></div>
        <div className="flex flex-col gap-y-2">
          {/* username */}
          <h1 className="text-5xl md:text-6xl font-extrabold">
            {user.display_name}
          </h1>
          {/* bio data */}
          <div className="flex flex-wrap gap-x-2 font-normal">
            <h3 className="lowercase">
              {user.email}
              <span className="font-bold">.</span>{" "}
            </h3>
            <h3 className="uppercase">
              {user.country}
              <span className="font-bold">.</span>
            </h3>
            <h3 className="capitalize">
              {user.product}
              <span className="font-bold">.</span>{" "}
            </h3>
          </div>
          {/* bio stats */}
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl font-semibold">
                {user.followers?.total}
              </h4>{" "}
              <h4 className="text-1xl font-thin">followers</h4>
            </div>
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl font-semibold">{followingTotal}</h4>{" "}
              <h4 className="text-1xl font-thin">following</h4>
            </div>
            <div className="flex items-center md:items-end gap-x-2">
              <h4 className="text-3xl font-semibold">{playlistsTotal}</h4>{" "}
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
        <div className="flex flex-wrap gap-2 font-bold justify-center mt-5">
          <div
            className="flex justify-center capitalize rounded-lg p-16 cursor-pointer"
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
          >
            top artists
          </div>
          <div
            className="flex justify-center capitalize rounded-lg p-16 cursor-pointer"
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
          >
            top tracks
          </div>
          <div
            className="flex justify-center capitalize rounded-lg p-16 cursor-pointer"
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
          >
            top genres
          </div>
          <div
            className="flex justify-center capitalize rounded-lg p-16 cursor-pointer"
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
          >
            top shows
          </div>
          <div
            className="flex justify-center capitalize rounded-lg p-16 cursor-pointer"
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
          >
            play highlights
          </div>
        </div>
      </section>
    </main>
  );
};

export default dashboard;
