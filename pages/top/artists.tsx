import React, { useState } from "react";
import TopItems, { TopItem } from "../../components/TopItems";
import { useQuery } from "@tanstack/react-query";

import getTopItems from "../../utils/requestUtils/getCurrentUserTopItems";
import useCrStore from "../../store";

const TopArtists = () => {
  const [timeRangeQuery, setTimeRangeQuery] = useState("short_term");
  // get accessToken from the store
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  // get top artists
  const topArtistsRes = useQuery(
    ["top-artists", accessToken, timeRangeQuery],
    () =>
      getTopItems(
        accessToken!,
        "artists",
        refreshToken!,
        setAccessTknData,
        timeRangeQuery
      )
  );
  const topArtists = topArtistsRes?.data;

  function getTimeRangeFilter(filter: string) {
    setTimeRangeQuery(filter);
  }

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
      setTimeRangeFilter={getTimeRangeFilter}
      showFilters={true}
    />
  );
};

export default TopArtists;
