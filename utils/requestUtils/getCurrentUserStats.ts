import { CrAccessTokenData } from "../../store";
import { decryptToken, getRefreshedToken } from "../auth";

async function getCurrentUserStats(
  accessToken: string,
  stat: string,
  refreshToken: string,
  setAccessTknData: (payload: CrAccessTokenData) => void
) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/me/${stat}?&limit=50`;
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
      await getRefreshedToken(refreshToken, setAccessTknData);

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
