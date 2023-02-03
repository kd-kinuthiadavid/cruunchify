import React from "react";
import { formatNumber } from "../../utils";

const ArtistInfo = ({ artist }: { artist: any }) => {
  return (
    <div className="mb-5 flex flex-col gap-y-4">
      <h1 className="font-black text-7xl">{artist?.name}</h1>
      <div className="flex gap-2">
        {artist?.genres?.map((genre: string, idx: number) => (
          <p className="bg-cr-muted py-3 px-5 rounded-3xl font-semibold capitalize">
            {genre}
          </p>
        ))}
      </div>
      <div className="flex gap-5">
        {/* popularity */}
        <div className="flex items-center gap-4 bg-cr-modal py-4 px-7 rounded-lg">
          <i className="text-cr-light-green text-3xl fa-solid fa-fire"></i>
          <div className="flex flex-col gap-y-1">
            <p className="text-md font-medium">Popularity</p>
            <p className="font-black text-2xl">{artist?.popularity} %</p>
          </div>
        </div>
        {/* followers */}
        <div className="flex items-center gap-4 bg-cr-modal py-4 px-7 rounded-lg">
          <i className="text-cr-light-green text-3xl fa-solid fa-heart"></i>
          <div className="flex flex-col gap-y-1">
            <p className="text-md font-medium">Followers</p>
            <p className="font-black text-2xl">
              {formatNumber(artist?.followers?.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
