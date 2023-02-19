import { useMutation, useQuery } from "@tanstack/react-query";
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
import createPlaylist, {
  PlaylistPayload,
} from "../../../utils/requestUtils/createPlaylist";
import updatePlaylist from "../../../utils/requestUtils/updatePlaylist";
import CrDialog from "../../../components/CrDialog";

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
    currentUser,
  } = useCrStore();
  const [artistImgURL, setArtistImgURL] = useState("");
  const [filters, setFilters] = useState<ArtistDetailFilters>({
    songs: true,
    albums: false,
    recommended: false,
  });
  const [URIs, setURIs] = useState<Array<string>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErr, setIsModalErr] = useState(false);
  const [recommendationsParams, setRecommendationsParams] =
    useState<GetRecommendationsParams>({
      seed_artists: "",
      seed_genres: "",
      seed_tracks: "",
    });
  const [createdPlaylist, setCreatedPlaylist] = useState<{
    id?: string;
    href?: string;
    uri?: string;
    externalUrl?: string;
  }>({});
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

  useEffect(() => {
    const topGenresSeeds = artist?.genres?.slice(0, 2)?.join(",");
    const topTracksSeeds = topSongs
      ?.slice(0, 2)
      ?.map((track: any) => track.id)
      ?.join(",");
    setRecommendationsParams({
      seed_artists: artistId,
      seed_genres: topGenresSeeds,
      seed_tracks: topTracksSeeds,
    });
  }, [topSongs, artistId]);

  const recommendedArtists = RecommendedArtistsRes.data?.artists;
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
  const recommendedTracks = recommendationsRes?.data?.tracks;

  useEffect(() => {
    setArtistImgURL(artistRes.data?.images[0]?.url);
  }, [artistRes]);

  useEffect(() => {
    setURIs(recommendedTracks?.map((track: any) => track?.uri));
  }, [recommendedTracks]);

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

  const createPlaylistMutation = useMutation({
    mutationFn: (payload: PlaylistPayload) =>
      createPlaylist(accessToken!, currentUser?.id!, payload),
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: ({
      uris,
      playlistId,
    }: {
      uris: Array<string>;
      playlistId: string;
    }) => updatePlaylist(accessToken!, playlistId, uris),
  });

  const createPlaylistPayload = {
    name: `Cruunchify: A ${artist?.name} Recommended Playlist`,
    description: `You seem to like ${artist?.name} a lot. Here's a playlist of other tracks similar to what ${artist?.name} makes as recommended by Cruunchify. Enjoy and don't forget to share Cruunchify with family and friends.`,
    collaborative: false,
    public: true,
  };

  function handleGeneratePlaylist() {
    console.log(">>> gen playlist >>");
    createPlaylistMutation.mutate(createPlaylistPayload, {
      onSuccess: (data, variables, context) => {
        // update state
        // this will be important when showing the success modal
        setCreatedPlaylist({
          id: data.id,
          href: data.href,
          uri: data.uri,
          externalUrl: data.external_urls.spotify,
        });

        // update the created playlist
        updatePlaylistMutation.mutate(
          { uris: URIs, playlistId: data.id },
          {
            onSuccess: (data, variables, _) => {
              setIsModalOpen(true);
            },
            onError: (error, variables, _) => {
              setIsModalErr(true);
            },
          }
        );
      },
      onError: (error, variables, context) => {
        setIsModalErr(true);
      },
    });
  }

  function onModalClose() {
    setIsModalErr(false);
    setIsModalOpen(false);
  }

  function openPlaylistInSpotify() {
    window.open(createdPlaylist.externalUrl, "_blank");
    onModalClose();
  }

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
        <button
          className="btn-primary font-semibold"
          onClick={handleGeneratePlaylist}
        >
          <Image
            src="/icons/Playlist.png"
            height={30}
            width={30}
            alt="icon: cruunchify logo"
          />
          Generate Playlist
        </button>
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
                isLoading={RecommendedArtistsRes.isLoading}
                relatedArtists={recommendedArtists}
              />
            ) : null}
          </div>
        </div>
      </section>

      <CrDialog isOpen={isModalOpen} onModalClose={onModalClose}>
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-5 items-center">
            <i
              className={`text-3xl ${
                isModalErr
                  ? "fa-solid fa-triangle-exclamation text-red-600"
                  : "fa-regular fa-circle-check text-cr-green"
              } `}
            ></i>
            <p className={`font-semibold text-3xl text-cr-green`}>
              {isModalErr ? "Oops! That didn't work." : "Success"}
            </p>
          </div>
          <p className="text-xl">
            {isModalErr
              ? "Something went wrong while creating your playlist. Please try again"
              : "Your playlist was created successfully"}
          </p>
          <button
            className="btn-primary mt-5 hover:bg-cr-modal"
            onClick={
              isModalErr ? handleGeneratePlaylist : openPlaylistInSpotify
            }
          >
            {isModalErr ? "Re-Try" : "Open In Spotify"}
          </button>
        </div>
      </CrDialog>
    </main>
  );
};

export default ArtistDetail;
