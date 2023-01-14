import Image from "next/image";
import React, { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";

interface TopItem {
  images: Array<any>;
  name: string;
  type: string;
  id: string;
  href: string;
}

interface TopItemsProps {
  title: string;
  description: string;
  itemsArr: Array<TopItem>;
  btnText: string;
  isLoading: boolean;
}

const TopItems = ({
  title,
  description,
  itemsArr,
  btnText,
  isLoading,
}: TopItemsProps) => {
  const loaderRef = useRef<any>(null);

  useEffect(() => {
    loaderRef?.current?.continuousStart();

    return () => {
      loaderRef?.current?.complete();
    };
  }, []);

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-y-20 lg:gap-x-28 mx-20 mb-10">
      {isLoading ? <LoadingBar color="#33FF7A" ref={loaderRef} /> : null}
      <section className="flex flex-col gap-5 lg:gap-y-8 justify-center text-center lg:justify-start lg:text-left md:mt-16">
        <h1 className="text-7xl capitalize font-extrabold">
          your top <br />
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
        <div className="flex justify-center items-center gap-x-7">
          <small className="uppercase font-medium cursor-pointer hover:text-cr-light-green">
            recent
          </small>
          <small className="uppercase font-medium cursor-pointer hover:text-cr-light-green">
            {" "}
            past 6 months
          </small>
          <small className="uppercase font-medium cursor-pointer hover:text-cr-light-green">
            all time
          </small>
        </div>
        {/* item cards */}
        <div className="flex flex-wrap gap-5 justify-center items-center max-h-[500px] md:max-h-[700px] overflow-y-scroll">
          {itemsArr?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg cursor-pointer hover:text-cr-light-green"
            >
              <Image
                className="rounded-lg"
                src={item.images[0].url}
                width={200}
                height={200}
                alt={`cruunchify top ${title}: ${item.name}`}
              />
              <p className="font-medium text-lg text-center">
                {idx + 1}. {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TopItems;
export type { TopItem };
