import { decryptToken } from "../auth";

interface PlaylistPayload {
  name: string;
  description: string;
  collaborative: boolean;
  public: boolean;
}

async function createPlaylist(
  accessToken: string,
  userId: string,
  payload: PlaylistPayload
) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/users/${userId}/playlists`;
  try {
    const res = await (
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify(payload),
      })
    ).json();
    if (res.error) {
      throw new Error(res.error.message, {
        ...res.error,
      });
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default createPlaylist;
export type { PlaylistPayload };
