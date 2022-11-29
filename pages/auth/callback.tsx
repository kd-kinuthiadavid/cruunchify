import { useRouter } from "next/router";
import React from "react";
import querystring from "querystring";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { login } from "../../utils/auth";

const callback = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  if (data.error) {
    return (
      <div>
        <h2>{data.error.message}</h2>
        <h3>{data.error.description}</h3>
        <p>Your session expired, please log in</p>
        <button onClick={() => login(router)}>login</button>
      </div>
    );
  }
  return <div>success</div>;
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
