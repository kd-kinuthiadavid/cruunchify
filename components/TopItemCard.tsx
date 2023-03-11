import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface TopItemCardProps {
  imgSrc: string;
  topItem: string;
  title: string;
  idx: number;
  id: string;
  spotifyURL: string;
}

const TopItemCard = ({
  imgSrc,
  topItem,
  title,
  idx,
  id,
  spotifyURL,
}: TopItemCardProps) => {
  const router = useRouter();

  function redirectToTopItem({ topItem, id }: { topItem: string; id: string }) {
    const itemsComingSoon = ["album", "show", "shows"];
    if (topItem === "artist" || topItem === "artists") {
      router.push(`/top/artists/${id}`);
    } else if (topItem === "tracks" || topItem === "track") {
      router.push(`/top/tracks/${id}`);
    } else if (itemsComingSoon.includes(topItem)) {
      router.push("/comingSoon");
    } else {
      router.push("/404");
    }
  }
  return (
    <div className="rounded-lg cursor-pointer p-2 bg-[#181818] hover:bg-[#2b2a2a] flex flex-col">
      <Image
        className="rounded-lg drop-shadow-md hover:drop-shadow-lg"
        src={imgSrc}
        width={200}
        height={200}
        alt={`cruunchify top ${topItem}: ${title}`}
        priority
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        onClick={() => redirectToTopItem({ topItem, id })}
      />
      <div className="flex justify-between gap-x-5 items-center">
        <p className="font-medium text-lg text-left max-w-[150px] truncate my-2">
          {idx}. {title}
        </p>
        <i
          className="text-xl fa-brands fa-spotify"
          onClick={() => window.open(`${spotifyURL}`, "_blank")}
        ></i>
      </div>
    </div>
  );
};

export default TopItemCard;
