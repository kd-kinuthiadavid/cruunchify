import React from "react";
import TopItemsLoader from "../TopItemsLoader";
import TopItemCard from "../TopItemCard";

const ArtistAlbums = ({
  albums,
  isLoading,
}: {
  albums: any;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading ? (
        <TopItemsLoader />
      ) : (
        albums.map((item: any, idx: number) => (
          <TopItemCard
            key={idx}
            idx={idx + 1}
            imgSrc={item.images[0].url}
            topItem={item.type}
            title={item.name}
            id={item.id}
          />
        ))
      )}
    </>
  );
};

export default ArtistAlbums;
