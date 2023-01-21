import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

interface TopItem {
  images: Array<any>;
  name: string;
  type: string;
  id: string;
  href: string;
  album?: any;
  show?: any;
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

  useEffect(() => {
    loaderRef?.current?.continuousStart();

    return () => {
      loaderRef?.current?.complete();
    };
  }, []);

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

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-y-20 lg:gap-x-28 mx-20 mb-10">
      {isLoading ? <LoadingBar color="#33FF7A" ref={loaderRef} /> : null}
      <section className="flex flex-col gap-5 lg:gap-y-8 justify-center text-center lg:justify-start lg:text-left md:mt-16">
        <h1 className="text-7xl capitalize font-extrabold">
          your {title === "shows" ? "saved" : "top"} <br />
          <span className="text-cr-green">{title}</span>
        </h1>
        <p className="text-3xl font-thin max-w-md">{description}</p>
        <button className="btn-primary mt-5">
          <Image
            src="/icons/Playlist.png"
            height={30}
            width={30}
            alt="icon: cruunchify logo"
          />
          {btnText}
        </button>
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
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 max-h-[500px] md:max-h-[700px] mb-20 lg:mb-0 overflow-y-scroll animate-pulse">
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a]"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="w-[180px] h-[180px] bg-[#2b2a2a]"></div>
              <div className="w-[140px] h-[20px] bg-[#2b2a2a] rounded-sm"></div>
              <div className="w-[100px] h-[10px] bg-[#2b2a2a] rounded-sm"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll mb-20 lg:mb-0">
            {itemsArr?.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg cursor-pointer p-2 bg-[#181818] hover:bg-[#2b2a2a]"
              >
                <Image
                  className="rounded-lg drop-shadow-md hover:drop-shadow-lg"
                  src={item.images[0].url}
                  width={200}
                  height={200}
                  alt={`cruunchify top ${title}: ${item.name}`}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                />
                <p className="font-medium text-lg text-left max-w-[200px] truncate my-2">
                  {idx + 1}. {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TopItems;
export type { TopItem };
