import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useCrStore from "../../../store";
import getArtistDetails from "../../../utils/requestUtils/getArtistDetails";
import Image from "next/image";
import { formatNumber } from "../../../utils";
import ArtistInfo from "../../../components/Artists/ArtistInfo";
import TopItemsLoader from "../../../components/TopItemsLoader";
import TopItemCard from "../../../components/TopItemCard";

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
  const [itemsArr, setItemsArr] = useState([]);
  const [filters, setFilters] = useState<ArtistDetailFilters>({
    songs: true,
    albums: false,
    recommended: false,
  });
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
  const topSongs = artistSongsRes.data;

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
  const albums = artistAlbumsRes.data;

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
  const recommendedArtists = RecommendedArtistsRes.data;

  console.log(">>>> albums >>>>", albums);
  useEffect(() => {
    setArtistImgURL(artistRes.data?.images[0]?.url);
  }, [artistRes]);

  useEffect(() => {
    if (filters.songs) {
      setItemsArr(topSongs?.tracks);
    } else if (filters.recommended) {
      setItemsArr(recommendedArtists?.artists);
    } else if (filters.albums) {
      setItemsArr(albums.items);
    } else {
      setItemsArr(topSongs?.tracks);
    }
  }, [filters, topSongs]);

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
        <button className="btn-primary font-semibold">
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
          {RecommendedArtistsRes.isLoading ||
          artistAlbumsRes.isLoading ||
          artistSongsRes.isLoading ? (
            <TopItemsLoader />
          ) : (
            <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll mb-20 lg:mb-0">
              {itemsArr?.map((item, idx) => (
                <TopItemCard
                  key={idx}
                  idx={idx + 1}
                  imgSrc={
                    filters.songs
                      ? item?.album?.images[0].url
                      : item.images[0].url
                  }
                  topItem={item.type}
                  title={item.name}
                  id={item.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ArtistDetail;
