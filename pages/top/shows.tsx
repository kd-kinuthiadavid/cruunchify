import React from "react";
import useCrStore from "../../store";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserStats from "../../utils/requestUtils/getCurrentUserStats";
import TopItems, { TopItem } from "../../components/TopItems";

const TopShows = () => {
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  const topShowsRes = useQuery(["top-shows", accessToken!], () =>
    getCurrentUserStats(accessToken!, "shows", refreshToken!, setAccessTknData)
  );

  return (
    <TopItems
      title="shows"
      description="Showing all the shows saved in your library"
      itemsArr={topShowsRes?.data?.items?.map((show: TopItem) => ({
        name: show?.show?.name,
        type: show?.show?.type,
        id: show?.show?.id,
        images: show?.show?.images,
      }))}
      btnText="generate playlist"
      isLoading={topShowsRes?.isLoading}
      showFilters={false}
    />
  );
};

export default TopShows;
