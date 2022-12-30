import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import querystring from "querystring";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import LoadingBar from "react-top-loading-bar";
import { login } from "../../utils/auth";

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

  useEffect(() => {
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
  }, []);

  if (data.error) {
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

      // <div className="text-red-500">
      //   <h2>{data.error.message}</h2>
      //   <h3>{data.error.description}</h3>
      //   <p>Your session expired, please log in</p>
      //   <button onClick={() => login(router)}>login</button>
      // </div>
    );
  }
  return (
    <main className="flex">
      <section>Discover</section>
      <section>Explore</section>
      <section>Create</section>
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
