import { decryptToken } from "../auth";

async function updatePlaylist(
  accessToken: string,
  playlistId: string,
  URIs: Array<string>
) {
  const decryptedToken = decryptToken(accessToken);
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/tracks`;
  console.log("}}}}}}}}}}] url }}}}}}}}}", url);
  try {
    const res = await (
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          uris: URIs,
        }),
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

export default updatePlaylist;
