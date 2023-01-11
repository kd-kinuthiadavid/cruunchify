import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import useCrStore, { SpotifyUser } from "../store";
import Image from "next/image";
import { useRouter } from "next/router";

const dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SpotifyUser>({});
  const loaderRef = useRef(null);
  const { currentUser } = useCrStore();
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

  return (
    <main className="flex justify-center items-center gap-x-10 h-full">
      {isLoading ? <LoadingBar color="#33FF7A" ref={loaderRef} /> : null}
      {/* <p>dashboard</p>
      <p>{user.country}</p>
      <p>{user.display_name}</p> */}
      <section className="flex flex-col gap-y-10">
        <div
          className="w-[400px] h-[500px] bg-no-repeat bg-center bg-cover border-5 border-red-500 rounded-lg"
          style={{
            backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%), url(${currentUserProfilePhotoURL})`,
          }}
        ></div>
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
      <section className="text-green-500">Lorem ipsum dolor sit amet.</section>
    </main>
  );
};

export default dashboard;
