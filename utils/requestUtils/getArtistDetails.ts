import { CrAccessTokenData } from "../../store";
import { decryptToken, getRefreshedToken } from "../auth";

async function getArtistDetails(
  URL: string,
  accessToken: string,
  refreshToken: string,
  setAccessTknData: (payload: CrAccessTokenData) => void
) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/artists/${URL}`;
  try {
    const res = await(
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    if (
      res.error &&
      res?.error?.message === "The access token expired" &&
      res?.error?.status === 401
    ) {
      await getRefreshedToken(refreshToken, setAccessTknData);
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default getArtistDetails;
