import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import useCrStore from "../../../store";
import getArtistDetails from "../../../utils/requestUtils/getArtistDetails";

const ArtistDetail = () => {
  const router = useRouter();
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
  } = useCrStore();
  const artistId = router.query?.id as string;
  console.log("???? artistId ???", artistId);

  const artistRes = useQuery(["artist-detail", artistId, accessToken], () =>
    getArtistDetails(accessToken!, artistId!)
  );

  console.log(">>>> artist >>>>", artistRes.data);

  return (
    <main className="flex flex-col justify-center items-center">
      <section className="flex">section 1</section>
      <section className="flex">section 2</section>
    </main>
  );
};

export default ArtistDetail;
