import React from "react";

const TrackInfo = ({ track }: { track: any }) => {
  return (
    <section className="flex flex-col">
      <h1 className="font-black text-7xl text-white">{track?.name}</h1>
      <div className="flex flex-wrap gap-x-3">
        {track?.artists?.map((artist: any, idx: number) => (
          <h3 className="font-bold text-gray-400 cursor-pointer" key={idx}>
            {artist?.name}
          </h3>
        ))}
      </div>
    </section>
  );
};

export default TrackInfo;
