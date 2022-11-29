import { NextRouter } from "next/router";

/**
 * Request authorization to access data
 * - adapted from @link: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
 */
function login(router: NextRouter) {
  const respType = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_RESP_TYPE || "";
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  const scope = "user-read-private user-read-email";
  const redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI || "";
  const state = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_STATE || "";

  const URLParams: URLSearchParams | undefined = new URLSearchParams({
    client_id: clientId,
    response_type: respType,
    redirect_uri: redirectURI,
    state,
    scope,
  });

  const authRedirectURI = `${process.env.NEXT_PUBLIC_SPOTIFY_ACS_BASE_URL}/authorize?${URLParams}`;
  // redirect the user to spotify's authorization dialog/page to authorize access
  router.push(authRedirectURI);
}

export { login };
