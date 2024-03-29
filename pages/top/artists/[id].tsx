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
import GeneratePlaylist from "../../../components/generatePlaylist";
import useGetRecommendations from "../../../components/useGetRecommendations";

interface ArtistDetailFilters {
  songs: boolean;
  albums: boolean;
  recommended: boolean;
}

const ArtistDetail = () => {
  const router = useRouter();
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();
  const [artistImgURL, setArtistImgURL] = useState("");
  const [filters, setFilters] = useState<ArtistDetailFilters>({
    songs: true,
    albums: false,
    recommended: false,
  });
  const [URIs, setURIs] = useState<Array<string>>([]);
  const artistId = router.query?.id as string;

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

  // get artist's top songs
  const artistSongsRes = useQuery(
    ["artist-top-songs", artistId, accessToken],
    () =>
      getArtistDetails(
        `${artistId}/top-tracks?market=KE`,
        accessToken!,
        refreshToken!,
        setAccessTknData
      )
  );
  const topSongs = artistSongsRes.data?.tracks;

  // get artist's albums
  const artistAlbumsRes = useQuery(
    ["artist-albums", artistId, accessToken],
    () =>
      getArtistDetails(
        `${artistId}/albums`,
        accessToken!,
        refreshToken!,
        setAccessTknData
      )
  );
  const albums = artistAlbumsRes.data?.items;

  const { recommendedArtistsRes, recommendedTracksRes } = useGetRecommendations(
    {
      tracks: topSongs,
      artistId,
      parent: "artist",
    }
  );

  useEffect(() => {
    setArtistImgURL(artistRes.data?.images[0]?.url);
  }, [artist]);

  useEffect(() => {
    setURIs(
      recommendedTracksRes?.data?.tracks?.map((track: any) => track?.uri)
    );
  }, [recommendedTracksRes]);

  const toggleFiltersTimeRange = (filter: string) => {
    switch (filter) {
      case "songs":
        {
          setFilters({
            songs: true,
            albums: false,
            recommended: false,
          });
        }
        break;
      case "albums":
        {
          setFilters({
            songs: false,
            albums: true,
            recommended: false,
          });
        }
        break;
      case "recommended":
        {
          setFilters({
            songs: false,
            albums: false,
            recommended: true,
          });
        }
        break;
      default:
        break;
    }
  };

  const createPlaylistPayload = {
    name: `Cruunchify: A ${artist?.name} Recommended Playlist`,
    description: `You seem to like ${artist?.name} a lot. Here's a playlist of other tracks similar to what ${artist?.name} makes as recommended by Cruunchify. Enjoy and don't forget to share Cruunchify with family and friends.`,
    collaborative: false,
    public: true,
  };

  return (
    <main className="flex flex-col justify-center items-center lg:items-start gap-y-10 lg:flex-row lg:gap-x-28 lg:mx-20">
      <section className="flex flex-col gap-y-5 w-3/4 md:w-2/4 lg:max-w-md h-full lg:sticky lg:top-40">
        <div className="h-[300px] md:h-[420px] relative bg-no-repeat bg-center bg-cover border-5 rounded-lg">
          <Image
            src={artistImgURL}
            layout="fill"
            className="rounded-lg"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8N02kHgAGKwIZBBZ7nwAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="lg:hidden">
          <ArtistInfo artist={artist} />
        </div>
        <GeneratePlaylist
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
        </button>
      </section>
      <section className="flex flex-col gap-y-10">
        {/* Artist Info */}
        <div className="hidden lg:block">
          <ArtistInfo artist={artist} />
        </div>
        <div className="flex flex-col justify-center items-center gap-y-5 md:max-w-screen-lg">
          {/* filters */}
          <div className="flex justify-center items-center gap-x-7">
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.songs ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("songs")}
            >
              top songs
            </small>
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.albums ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("albums")}
            >
              {" "}
              Albums
            </small>
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.recommended ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("recommended")}
            >
              recommended artists
            </small>
          </div>
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll mb-20 lg:mb-0">
            {filters.songs ? (
              <ArtistTopSongs
                isLoading={artistSongsRes.isLoading}
                topSongs={topSongs}
              />
            ) : filters.albums ? (
              <ArtistAlbums
                isLoading={artistAlbumsRes.isLoading}
                albums={albums}
              />
            ) : filters.recommended ? (
              <RelatedArtists
                isLoading={recommendedArtistsRes?.isLoading}
                relatedArtists={recommendedArtistsRes?.data?.artists}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArtistDetail;
