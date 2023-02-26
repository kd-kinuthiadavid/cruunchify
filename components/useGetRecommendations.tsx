import { useEffect, useState } from "react";
import getRecommendations, {
  GetRecommendationsParams,
} from "../utils/requestUtils/getRecommendations";
import { useQuery } from "@tanstack/react-query";
import useCrStore from "../store";
import getArtistDetails from "../utils/requestUtils/getArtistDetails";

interface useGetRecommendationsProps {
  tracks: Array<any>;
  artistId: string;
  parent: "track" | "artist";
}

const useGetRecommendations = ({
  tracks,
  artistId,
  parent,
}: useGetRecommendationsProps) => {
  // hooks
  const [recommendationsParams, setRecommendationsParams] =
    useState<GetRecommendationsParams>({
      seed_artists: "",
      seed_genres: "",
      seed_tracks: "",
    });
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  // effects
  // get artist details
  const artistRes = useQuery(["artist-detail", artistId, accessToken], () =>
    getArtistDetails(
      `${artistId}`,
      accessToken!,
      refreshToken!,
      setAccessTknData
    )
  );
  const artist = artistRes.data;

  useEffect(() => {
    const topGenresSeeds =
      parent === "artist"
        ? artist?.genres?.slice(0, 2)?.join(",")
        : artist?.genres?.slice(0, 3)?.join(",");
    const topTracksSeeds = tracks
      ?.slice(0, 2)
      ?.map((track: any) => track.id)
      ?.join(",");

    setRecommendationsParams({
      seed_artists: artistId,
      seed_genres: topGenresSeeds,
      seed_tracks: topTracksSeeds,
    });
  }, [artistId]);

  // queries and mutations

  // get artist's albums
  const RecommendedArtistsRes = useQuery(
    ["artist-recommended-artists", artistId, accessToken],
    () =>
      getArtistDetails(
        `${artistId}/related-artists`,
        accessToken!,
        refreshToken!,
        setAccessTknData
      )
  );

  console.log("%%%%% recommendationsParams %%%%%", recommendationsParams);

  // get recommended tracks
  const recommendationsRes = useQuery(
    ["artist-recommendations", accessToken, recommendationsParams],
    () =>
      getRecommendations(
        recommendationsParams,
        accessToken!,
        refreshToken!,
        setAccessTknData
      )
  );

  return {
    recommendedTracksRes: recommendationsRes,
    recommendedArtistsRes: RecommendedArtistsRes,
  };
};

export default useGetRecommendations;
