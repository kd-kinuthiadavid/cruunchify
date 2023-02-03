import React from "react";
import TopItemsLoader from "../TopItemsLoader";
import TopItemCard from "../TopItemCard";

const RelatedArtists = ({
  relatedArtists,
  isLoading,
}: {
  relatedArtists: any;
  isLoading: boolean;
}) => {
  return (
    <>
      {isLoading ? (
        <TopItemsLoader />
      ) : (
        relatedArtists.map((item: any, idx: number) => (
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

export default RelatedArtists;
