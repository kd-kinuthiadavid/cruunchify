import React, { useState } from "react";
import useCrStore from "../../store";
import { useQuery } from "@tanstack/react-query";
import getTopItems from "../../utils/requestUtils/getCurrentUserTopItems";
import TopItems, { TopItem } from "../../components/TopItems";

const TopTracks = () => {
  const [timeRangeQuery, setTimeRangeQuery] = useState("short_term");
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  const topTracksRes = useQuery(
    ["top-tracks", accessToken, timeRangeQuery],
    () =>
      getTopItems(
        accessToken!,
        "tracks",
        refreshToken!,
        setAccessTknData,
        timeRangeQuery
      )
  );
  const topTracks = topTracksRes?.data;

  function getTimeRangeFilter(filter: string) {
    setTimeRangeQuery(filter);
  }

  return (
    <TopItems
      title="tracks"
      description="Showing your favourite tracks in the past 30 days"
      btnText="generate playlist"
      itemsArr={topTracks?.items?.map((track: TopItem) => ({
        name: track.name,
        type: track.type,
        id: track.id,
        images: track?.album?.images,
      }))}
      isLoading={topTracksRes?.isLoading}
      setTimeRangeFilter={getTimeRangeFilter}
    />
  );
};

export default TopTracks;
