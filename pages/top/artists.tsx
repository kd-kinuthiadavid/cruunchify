import React from "react";
import TopItems, { TopItem } from "../../components/TopItems";
import { useQuery } from "@tanstack/react-query";

import getTopItems from "../../utils/requestUtils/getCurrentUserTopItems";
import useCrStore from "../../store";

const TopArtists = () => {
  // get accessToken from the store
  const {
    accessTokenData: { accessToken },
  } = useCrStore();

  // get top artists
  const topArtistsRes = useQuery(["top-artists", accessToken], () =>
    getTopItems(accessToken!, "artists")
  );
  const topArtists = topArtistsRes?.data;

  console.log(">>>> topArtistsRes >>>>", topArtists);
  return (
    <TopItems
      title="artists"
      description="Showing your favourite artists in the past 30 days"
      itemsArr={topArtists?.items?.map((artist: TopItem) => ({
        images: artist.images,
        name: artist.name,
        type: artist.type,
        id: artist.id,
        href: artist.href,
      }))}
      btnText="generate playlist"
      isLoading={topArtistsRes?.isLoading}
    />
  );
};

export default TopArtists;
