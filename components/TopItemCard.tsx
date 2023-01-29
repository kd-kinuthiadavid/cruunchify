import Image from "next/image";
import React from "react";

interface TopItemCardProps {
  imgSrc: string;
  topItem: string;
  title: string;
  idx: number;
}

const TopItemCard = ({ imgSrc, topItem, title, idx }: TopItemCardProps) => {
  return (
    <div className="rounded-lg cursor-pointer p-2 bg-[#181818] hover:bg-[#2b2a2a]">
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
