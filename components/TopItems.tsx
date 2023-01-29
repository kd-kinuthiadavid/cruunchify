import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import TopItemsLoader from "./TopItemsLoader";
import useCrStore from "../store";
import { useMutation } from "@tanstack/react-query";
import createPlaylist, {
  PlaylistPayload,
} from "../utils/requestUtils/createPlaylist";
import { getRefreshedToken } from "../utils/auth";
import updatePlaylist from "../utils/requestUtils/updatePlaylist";
import TopItemCard from "./TopItemCard";

interface TopItem {
  images: Array<any>;
  name: string;
  type: string;
  id: string;
  href: string;
  album?: any;
  show?: any;
  uri?: string;
}

interface TopItemsProps {
  title: string;
  description: string;
  itemsArr: Array<TopItem>;
  btnText: string;
  isLoading: boolean;
  setTimeRangeFilter?: (filter: string) => void;
  showFilters: boolean;
}

interface TopItemsFilters {
  recent: boolean;
  sixMonths: boolean;
  allTime: boolean;
}

const TopItems = ({
  title,
  description,
  itemsArr,
  btnText,
  isLoading,
  setTimeRangeFilter,
  showFilters,
}: TopItemsProps) => {
  const loaderRef = useRef<any>(null);
  const [filters, setFilters] = useState<TopItemsFilters>({
    recent: true,
    sixMonths: false,
    allTime: false,
  });

  const [createdPlaylist, setCreatedPlaylist] = useState<{
    id?: string;
    href?: string;
    uri?: string;
    externalUrl?: string;
  }>({});

  const [URIs, setURIs] = useState<Array<string>>([]);

  useEffect(() => {
    loaderRef?.current?.continuousStart();

    return () => {
      loaderRef?.current?.complete();
    };
  }, []);

  useEffect(() => {
    if (itemsArr?.length) {
      const urisArr: Array<string> = [];
      itemsArr.forEach((item) => {
        urisArr.push(item.uri!);
      });
      setURIs(urisArr);
    }
  }, [itemsArr]);

  const toggleFiltersTimeRange = (filter: string) => {
    switch (filter) {
      case "recent":
        {
          setFilters({
            recent: true,
            sixMonths: false,
            allTime: false,
          });
          setTimeRangeFilter && setTimeRangeFilter("short_term");
        }
        break;
      case "sixMonths":
        {
          setFilters({
            recent: false,
            sixMonths: true,
            allTime: false,
          });
          setTimeRangeFilter && setTimeRangeFilter("medium_term");
        }
        break;
      case "allTime":
        {
          setFilters({
            recent: false,
            sixMonths: false,
            allTime: true,
          });
          setTimeRangeFilter && setTimeRangeFilter("long_term");
        }
        break;
      default:
        break;
    }
  };

  const {
    accessTokenData: { accessToken, refreshToken },
    currentUser,
    setAccessTknData,
  } = useCrStore();

  const createPlaylistPayload = {
    name: `Top ${title} playlist`,
    description: `A playlist of my top ${title} created in cruunchify.`,
    collaborative: false,
    public: true,
  };

  const playlistMutation = useMutation({
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

  function generatePlaylist() {
    // create the playlist
    if (title === "tracks") {
      playlistMutation.mutate(createPlaylistPayload, {
        onSuccess: (data, variables, context) => {
          console.log(
            "??? success creating playlist ????",
            "??? data ???",
            data,
            "??? variables ????",
            variables,
            "??? context ???",
            context
          );

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
                console.log(
                  "@@@@ SUCCESS UPDATING PLAYLIST @@@",
                  data,
                  variables
                );
                // @TODO: show the success modal
              },
              onError: (error, variables, _) => {
                console.error(
                  "@@@ ERROR UPDATING PLAYLIST @@@",
                  error,
                  variables
                );
                // @TODO: show an error snackbar
              },
            }
          );
        },
        onError: (error, variables, context) => {
          console.log("#### ERROR: #####", error, variables, context);
          // @TODO: show an error snackbar
        },
      });
    }
  }

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-y-20 lg:gap-x-28 mx-20 mb-10">
      {isLoading ? <LoadingBar color="#33FF7A" ref={loaderRef} /> : null}
      <section className="flex flex-col gap-5 lg:gap-y-8 justify-center text-center lg:justify-start lg:text-left md:mt-16">
        <h1 className="text-7xl capitalize font-extrabold">
          your {title === "shows" ? "saved" : "top"} <br />
          <span className="text-cr-green">{title}</span>
        </h1>
        <p className="text-3xl font-thin max-w-md">{description}</p>
        {title === "tracks" ? (
          <button className="btn-primary mt-5" onClick={generatePlaylist}>
            <Image
              src="/icons/Playlist.png"
              height={30}
              width={30}
              alt="icon: cruunchify logo"
            />
            {/* {btnText} */}
            {playlistMutation.isLoading || updatePlaylistMutation.isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 ..."
                viewBox="0 0 24 24"
              ></svg>
            ) : (
              `${btnText}`
            )}
          </button>
        ) : null}
      </section>
      <section className="flex flex-col justify-center items-center gap-y-5 md:max-w-screen-lg">
        {/* filters */}
        {showFilters ? (
          <div className="flex justify-center items-center gap-x-7">
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.recent ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("recent")}
            >
              recent
            </small>
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.sixMonths ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("sixMonths")}
            >
              {" "}
              past 6 months
            </small>
            <small
              className={`uppercase font-medium cursor-pointer hover:text-cr-light-green ${
                filters.allTime ? "text-cr-light-green" : ""
              }`}
              onClick={() => toggleFiltersTimeRange("allTime")}
            >
              all time
            </small>
          </div>
        ) : null}
        {/* item cards */}
        {isLoading ? (
          <TopItemsLoader />
        ) : (
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll mb-20 lg:mb-0">
            {itemsArr?.map((item, idx) => (
              <TopItemCard
                key={idx}
                idx={idx + 1}
                imgSrc={item.images[0].url}
                topItem={title}
                title={item.name}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TopItems;
export type { TopItem };
