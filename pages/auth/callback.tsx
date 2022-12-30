import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import querystring from "querystring";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import LoadingBar from "react-top-loading-bar";

import { login } from "../../utils/auth";
import useCrStore, { CrAccessTokenData } from "../../store";

interface CurrentTabState {
  discover: boolean;
  explore: boolean;
  create: boolean;
}

const callback = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<CurrentTabState>({
    discover: true,
    explore: false,
    create: false,
  });
  const loaderRef = useRef(null);
  const setAccessTokenData = useCrStore((state) => state.setAccessTknData);

  useEffect(() => {
    if (!data?.error) {
      loaderRef?.current?.continuousStart();
      const discTimeOut = setTimeout(
        () =>
          setCurrentTab({
            discover: false,
            explore: true,
            create: false,
          }),
        2000
      );
      const expTimeOut = setTimeout(
        () =>
          setCurrentTab({
            discover: false,
            explore: false,
            create: true,
          }),
        4000
      );
      const createTimeOut = setTimeout(() => router.push("/dashboard"), 6000);

      return () => {
        loaderRef?.current?.complete();
        clearTimeout(discTimeOut);
        clearTimeout(expTimeOut);
        clearTimeout(createTimeOut);
      };
    }
  }, [data]);

  if (data.error) {
    return (
      <section className="h-screen flex flex-col items-center gap-y-10 text-center">
        <h1 className="font-black text-9xl">Oops !</h1>
        <h2 className="font-black text-6xl text-cr-light-green">
          We hit a snag.
        </h2>
        <p className="font-bold text-3xl max-w-lg leading-normal">
          Something went wrong when connecting to Spotify. Please try again.
        </p>
        <button
          className="flex items-center bg-cr-light-green px-10 py-5 gap-x-5 rounded-md"
          onClick={() => login(router)}
        >
          <Image
            src="/icons/Spotify.png"
            height={30}
            width={30}
            alt="icon: spotify logo"
          />
          <small className="text-lg lg:text-xl capitalize">Try Again</small>
        </button>
      </section>
    );
  }

  // update the store
  const accessTknData: CrAccessTokenData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    scope: data.scope,
    tokenType: data.tokenType,
  };
  setAccessTokenData(accessTknData);

  return (
    <main className="h-screen flex flex-col items-center">
      <LoadingBar color="#33FF7A" ref={loaderRef} />
      <section className="flex justify-center gap-x-10">
        <div className="flex flex-col">
          <h1
            className={`text-3xl ${
              currentTab.discover ? "text-cr-light-green" : "text-cr-muted"
            } font-extrabold`}
          >
            1. Discover
          </h1>
        </div>
        <div className="flex flex-col">
          <h1
            className={`text-3xl ${
              currentTab.explore ? "text-cr-light-green" : "text-cr-muted"
            } font-extrabold`}
          >
            2. Explore
          </h1>
        </div>
        <div className="flex flex-col">
          <h1
            className={`text-3xl ${
              currentTab.create ? "text-cr-light-green" : "text-cr-muted"
            } font-extrabold`}
          >
            3. Create
          </h1>
        </div>
      </section>
      {currentTab.discover ? (
        <section className="flex  flex-col items-center mt-10 gap-10">
          <h2 className="text-6xl font-bold max-w-md text-center capitalize leading-tight">
            Discover how you listen to music
          </h2>
        </section>
      ) : null}
      {currentTab.explore ? (
        <section className="flex flex-col items-center mt-10 gap-10">
          <h2 className="text-6xl font-bold max-w-md text-center capitalize leading-tight">
            Explore your music taste
          </h2>
        </section>
      ) : null}
      {currentTab.create ? (
        <section className="flex flex-col items-center mt-10 gap-10">
          <h2 className="text-6xl font-bold max-w-md text-center capitalize leading-tight">
            Create awesome playlists
          </h2>
        </section>
      ) : null}
    </main>
  );
};

type AccessTokenDataError = {
  message: string | string[] | undefined;
  description?: string | string[] | undefined;
};

interface AccessTokenData {
  error?: AccessTokenDataError;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
}

export const getServerSideProps: GetServerSideProps<{
  data: AccessTokenData;
}> = async (context) => {
  const code = context.query.code;
  const error = context.query.error;
  const state = context.query.state;

  const data: AccessTokenData = {};

  if (error) {
    data.error = {
      message: error,
    };
  } else {
    // check if state matches what we provided in the authorization URI
    if (state === process.env.NEXT_PUBLIC_SPOTIFY_AUTH_STATE) {
      // get the accessTkn
      const authorization_code = "authorization_code";
      try {
        const res = await (
          await fetch(
            `${process.env.NEXT_PUBLIC_SPOTIFY_ACS_BASE_URL}/api/token`,
            {
              method: "post",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                  "Basic " +
                  new Buffer(
                    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID +
                      ":" +
                      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
                  ).toString("base64"),
              },
              body: querystring.stringify({
                grant_type: authorization_code,
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
              }),
            }
          )
        ).json();

        if (res.error) {
          /**
           * This means that the user accepted giving access to your app but something is wrong
           * with that authorization code, e.g, the authorization code has expired.
           * @example: {
              error: 'invalid_grant',
              error_description: 'Authorization code expired'
            }
          */
          data.error = {
            message: res.error,
            description: res.error_description,
          };
        } else {
          // SUCCESS: We now have an access token object
          data.accessToken = res.access_token;
          data.refreshToken = res.refresh_token;
          data.expiresIn = res.expires_in;
          data.scope = res.scope;
          data.tokenType = res.token_type;
        }
      } catch (error) {
        // This means that something went wrong when fetching the access token object
        // @TODO: handle this error
      }
    } else {
      data.error = {
        message: "state mismatch",
      };
    }
  }

  return {
    props: {
      data,
    },
  };
};

export default callback;
