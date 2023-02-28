import React, { useEffect, useState } from "react";
import useCrStore from "../../store";
import { useQuery } from "@tanstack/react-query";
import getTopItems from "../../utils/requestUtils/getCurrentUserTopItems";
import { generateRandomColor } from "../../utils";

interface TopGenre {
  name: string | any;
  percentage: string | any;
  allGenresCount: number | any;
}

const TopGenres = () => {
  // state
  const [topGenre, setTopGenre] = useState<TopGenre>({
    name: "",
    percentage: "",
    allGenresCount: 0,
  });
  const [topTenGenres, setTopTenGenres] = useState<any[]>([]);
  // hooks
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();

  // react-query
  const topArtistsRes = useQuery(["top-artists", accessToken], () =>
    getTopItems(
      accessToken!,
      "artists",
      refreshToken!,
      setAccessTknData,
      "medium_term"
    )
  );

  useEffect(() => {
    const topArtists = topArtistsRes.data?.items;
    let allGenres: string[] = [];
    topArtists?.forEach((artist: any) => {
      allGenres = [...allGenres, ...artist.genres];
    });

    const allGenresMap = allGenres.reduce(
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    );

    const sortedGenres: any = [...allGenresMap.entries()].sort(
      (a, b) => b[1] - a[1]
    );

    setTopGenre({
      name: sortedGenres[0][0],
      percentage: Math.ceil((sortedGenres[0][1] / sortedGenres.length) * 100),
      allGenresCount: sortedGenres.length,
    });

    setTopTenGenres(sortedGenres.slice(0, 12));
  }, [topArtistsRes.data?.items]);
  return (
    <section className="flex gap-y-10 flex-col items-center text-center">
      <div className="flex gap-x-3 items-center">
        <i className="fa-solid fa-medal font-black text-5xl text-cr-light-green"></i>
        <div className="text-3xl font-bold">{topGenre?.name}</div>
      </div>
      <h1 className="font-black text-9xl">
        <span className="text-cr-green">{topGenre?.name}</span>
        <br /> slaps hard
      </h1>
      <h2 className="font-thin text-3xl lg:max-w-3xl">
        Looks like you're a huge fan of{" "}
        <span className="text-cr-green font-bold">{topGenre?.name}</span>. This
        appears in{" "}
        <span className="text-cr-green font-bold">{topGenre?.percentage}%</span>{" "}
        of your top tracks. Nice one.
      </h2>
      <div className="mt-5 columns-2 md:columns-3 lg:max-w-1/2 mb-20">
        {topTenGenres?.map((genre, idx) => (
          <div
            className={`w-full h-full ${
              idx % 5 == 0 ? "aspect-square" : "aspect-video"
            } capitalize rounded-lg p-5 text-xl font-medium mb-3 text-left`}
            style={{
              backgroundColor: `${generateRandomColor()}`,
              backgroundImage: `linear-gradient(226.17deg, rgba(17,17,18,0) 0%, rgba(17,17,18,0.6) 100%)`,
            }}
            key={idx}
          >
            <span className="font-black">{genre[0]}</span>{" "}
            {Math.ceil((genre[1] / topGenre?.allGenresCount) * 100)}%
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopGenres;
