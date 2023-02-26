import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useCrStore from "../../../store";
import getArtistDetails from "../../../utils/requestUtils/getArtistDetails";
import Image from "next/image";
import ArtistInfo from "../../../components/Artists/ArtistInfo";
import ArtistTopSongs from "../../../components/Artists/ArtistTopSongs";
import ArtistAlbums from "../../../components/Artists/ArtistAlbums";
import RelatedArtists from "../../../components/Artists/RelatedArtists";
import getRecommendations, {
  GetRecommendationsParams,
} from "../../../utils/requestUtils/getRecommendations";
import GeneratePlaylist from "../../../components/generatePlaylist";
import getTrackDetails from "../../../utils/requestUtils/getTrackDetails";
import TrackInfo from "../../../components/Tracks/TrackInfo";
import useGetRecommendations from "../../../components/useGetRecommendations";

interface TrackDetailFilters {
  recTracks: boolean;
  recArtists: boolean;
}

const TrackDetails = () => {
  // state
  const [trackImgURL, setTrackImgURL] = useState("");
  const [filters, setFilters] = useState<TrackDetailFilters>({
    recTracks: true,
    recArtists: false,
  });
  // hooks
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
    currentUser,
  } = useCrStore();
  const router = useRouter();
  const trackId = router.query?.id as string;

  // get track details
  const trackRes = useQuery(["track-detail", trackId, accessToken], () =>
    getTrackDetails(
      trackId,
      currentUser?.country!,
      accessToken!,
      refreshToken!,
      setAccessTknData
    )
  );
  const track = trackRes.data;
  console.log("?????? TRACK ????????", track);

  const toggleFiltersTimeRange = (filter: string) => {
    switch (filter) {
      case "recTracks":
        {
          setFilters({
            recTracks: true,
            recArtists: false,
          });
        }
        break;
      case "recArtists":
        {
          setFilters({
            recArtists: true,
            recTracks: false,
          });
        }
        break;
      default:
        break;
    }
  };

  //   const createPlaylistPayload = {
  //     name: `Cruunchify: A ${artist?.name} Recommended Playlist`,
  //     description: `You seem to like ${artist?.name} a lot. Here's a playlist of other tracks similar to what ${artist?.name} makes as recommended by Cruunchify. Enjoy and don't forget to share Cruunchify with family and friends.`,
  //     collaborative: false,
  //     public: true,
  //   };

  useEffect(() => {
    setTrackImgURL(track?.album?.images[0]?.url);
  }, [track]);

  console.log("!!!!!!!!!! PARAMS FOR RECOMMS !!!!!!!!!!!", {
    tracks: [{ id: track?.id }],
    artistId: track?.artists[0]?.id,
    parent: "track",
  });

  const { recommendedArtistsRes, recommendedTracksRes } = useGetRecommendations(
    {
      tracks: [{ id: track?.id }],
      artistId: track?.artists[0]?.id,
      parent: "track",
    }
  );

  console.log(
    "######### recommended tracks #########",
    recommendedTracksRes?.data
  );
  console.log(
    "@@@@@@@@@@@@@ recommended artists @@@@@@@@@",
    recommendedArtistsRes?.data
  );

  return (
    <main className="flex flex-col justify-center items-center lg:items-start gap-y-10 lg:flex-row lg:gap-x-28 lg:mx-20">
      <section className="flex flex-col gap-y-5 w-3/4 md:w-2/4 lg:max-w-md h-full lg:sticky lg:top-40">
        <div className="h-[300px] md:h-[420px] relative bg-no-repeat bg-center bg-cover border-5 rounded-lg">
          <Image
            src={trackImgURL}
            layout="fill"
            className="rounded-lg"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8N02kHgAGKwIZBBZ7nwAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="lg:hidden">
          <TrackInfo track={track} />
        </div>
        {/* <GeneratePlaylist
          URIs={URIs}
          createPlaylistPayload={createPlaylistPayload}
        />
        <button
          className="btn-sec font-semibold"
          onClick={() =>
            window.open(`${artist.external_urls.spotify}`, "_blank")
          }
        >
          <i className="text-3xl fa-brands fa-spotify"></i>
          Open In Spotify
        </button> */}
      </section>
      <section className="flex flex-col gap-y-10">
        {/* Artist Info */}
        {/* <div className="hidden lg:block">
          <ArtistInfo artist={artist} />
        </div> */}
        <div className="flex flex-col justify-center items-center gap-y-5 md:max-w-screen-lg">
          {/* filters */}
          <div className="flex justify-center items-center gap-x-7">
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.recTracks ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("recTracks")}
            >
              recommended songs
            </small>
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.recArtists ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("recArtists")}
            >
              {" "}
              recommended artists
            </small>
          </div>
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll mb-20 lg:mb-0">
            {filters.recTracks ? (
              <ArtistTopSongs
                isLoading={recommendedTracksRes.isLoading}
                topSongs={recommendedTracksRes?.data?.tracks}
              />
            ) : filters.recArtists ? (
              <RelatedArtists
                isLoading={recommendedArtistsRes.isLoading}
                relatedArtists={recommendedArtistsRes?.data?.artists}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrackDetails;
