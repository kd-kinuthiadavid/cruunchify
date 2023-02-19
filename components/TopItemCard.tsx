import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

interface TopItemCardProps {
  imgSrc: string;
  topItem: string;
  title: string;
  idx: number;
  id: string;
}


const TopItemCard = ({ imgSrc, topItem, title, idx, id }: TopItemCardProps) => {
  const router = useRouter();

  function redirectToTopItem({ topItem, id }: { topItem: string; id: string }) {
    const itemsComingSoon = ["album", "track", "tracks", "show", "shows"];
    if (topItem === "artist" || topItem === "artists") {
      router.push(`/top/artists/${id}`);
    } else if (itemsComingSoon.includes(topItem)) {
      router.push("/comingSoon");
    } else {
      router.push("/404");
    }
  }
  return (
    <div
      className="rounded-lg cursor-pointer p-2 bg-[#181818] hover:bg-[#2b2a2a]"
      onClick={() => redirectToTopItem({ topItem, id })}
    >
      <Image
        className="rounded-lg drop-shadow-md hover:drop-shadow-lg"
        src={imgSrc}
        width={200}
        height={200}
        alt={`cruunchify top ${topItem}: ${title}`}
        priority
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      />
      <p className="font-medium text-lg text-left max-w-[200px] truncate my-2">
        {idx}. {title}
      </p>
    </div>
  );
};

export default TopItemCard;
