import { CrAccessTokenData } from "../../store";
import { decryptToken, getRefreshedToken } from "../auth";

interface GetRecommendationsParams {
  seed_artists: string;
  seed_genres: string;
  seed_tracks: string;
}

async function getRecommendations(
  { seed_artists, seed_genres, seed_tracks }: GetRecommendationsParams,
  accessToken: string,
  refreshToken: string,
  setAccessTknData: (payload: CrAccessTokenData) => void
) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/recommendations?market=KE&target_popularity=90&seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&limit=50`;
  try {
    const res = await (
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

export default getRecommendations;
export type { GetRecommendationsParams };
