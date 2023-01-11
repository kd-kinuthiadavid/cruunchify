import { decryptToken } from "../auth";

async function getCurrentUserStats(accessToken: string, stat: string) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/me/${stat}`;
  try {
    const res = await (
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (res.error && res.error.message !== "Invalid access token") {
      /**
       * @TODO:
       * - create a request wrapper
       * - on 'invalid access token' error:
       *      - use the refresh token to get a new access token
       *      - update the store with the new access token
       *      - refresh the page
       */
      throw new Error(res.error.message, {
        ...res.error,
      });
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default getCurrentUserStats;
