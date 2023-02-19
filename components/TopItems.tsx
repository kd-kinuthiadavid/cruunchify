import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import TopItemsLoader from "./TopItemsLoader";
import TopItemCard from "./TopItemCard";
import GeneratePlaylist from "./generatePlaylist";
import { useRouter } from "next/router";

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
  const [URIs, setURIs] = useState<Array<string>>([]);

  const router = useRouter();

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

  const createPlaylistPayload = {
    name: `Top ${title} playlist: ${
      filters.allTime
        ? "All Time"
        : filters.sixMonths
        ? "Last 60 Days"
        : filters.recent
        ? "Last 30 Days"
        : "Made by Cruunchify"
    }`,
    description: `A playlist of my ${
      filters.allTime ? "all time" : ""
    } top ${title} ${
      filters.recent
        ? "in the past 30 days"
        : filters.sixMonths
        ? "in the past 60 days"
        : ""
    }. Created in cruunchify.`,
    collaborative: false,
    public: true,
  };

  function shareTopItems() {
    router.push("/comingSoon");
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
          <GeneratePlaylist
            URIs={URIs}
            createPlaylistPayload={createPlaylistPayload}
          />
        ) : (
          <button className="btn-primary mt-5" onClick={shareTopItems}>
            <Image
              src="/icons/Playlist.png"
              height={30}
              width={30}
              alt="icon: cruunchify logo"
            />
            {"Share"}
          </button>
        )}
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
                id={item.id}
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
