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
      description={`Showing your ${
        timeRangeQuery === "long_term" ? "all time" : ""
      } favourite artists${
        timeRangeQuery === "long_term" ? "" : " in the past "
      }${
        timeRangeQuery === "short_term"
          ? "30 days"
          : timeRangeQuery === "medium_term"
          ? "6 months"
          : ""
      }`}
      itemsArr={topArtists?.items?.map((artist: TopItem) => ({
        images: artist.images,
        name: artist.name,
        type: artist.type,
        id: artist.id,
        href: artist.href,
        uri: artist.uri,
      }))}
      btnText="generate playlist"
      isLoading={topArtistsRes?.isLoading}
      setTimeRangeFilter={getTimeRangeFilter}
      showFilters={true}
    />
  );
};

export default TopArtists;
