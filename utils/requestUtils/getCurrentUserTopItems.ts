import { decryptToken } from "../auth";

async function getTopItems(accessToken: string, item: string) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/me/top/${item}`;
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
      throw new Error(res.error.message, {
        ...res.error,
      });
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default getTopItems;
