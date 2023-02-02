import { CrAccessTokenData } from "../../store";
import { decryptToken, getRefreshedToken } from "../auth";

async function getArtistDetails(
  accessToken: string,
  artistId: string,
  details?: string
) {
  const decryptedToken = decryptToken(accessToken);
  const url = details
    ? `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/artists/${artistId}/${details}`
    : `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/artists/${artistId}`;
  try {
    const res = await (
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();
    return res;
  } catch (error) {
    throw error;
  }
}

export default getArtistDetails;
