import { NextRouter } from "next/router";
import CryptoJS from "crypto-js";

/**
 * Request authorization to access data
 * - adapted from @link: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
 */
function login(router: NextRouter) {
  const respType = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_RESP_TYPE || "";
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  const scope =
    "user-read-private user-read-email user-library-read user-read-recently-played streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify user-read-playback-position user-read-currently-playing user-follow-read playlist-read-collaborative user-follow-modify playlist-read-private ugc-image-upload user-read-playback-state user-modify-playback-state";
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

function decryptToken(token: string): string {
  return CryptoJS.AES.decrypt(
    token!,
    process.env.NEXT_PUBLIC_ENC_SECRET_KEY!
  ).toString(CryptoJS.enc.Utf8);
}

export { login, decryptToken };
