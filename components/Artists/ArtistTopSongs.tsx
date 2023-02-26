import React from "react";
import TopItemsLoader from "../TopItemsLoader";
import TopItemCard from "../TopItemCard";

const ArtistTopSongs = ({
  topSongs,
  isLoading,
}: {
  topSongs: any;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading ? (
        <TopItemsLoader />
      ) : (
        topSongs?.map((item: any, idx: number) => (
          <TopItemCard
            key={idx}
            idx={idx + 1}
            imgSrc={item.album?.images[0].url}
            topItem={item.type}
            title={item.name}
            id={item.id}
          />
        ))
      )}
    </>
  );
};

export default ArtistTopSongs;
