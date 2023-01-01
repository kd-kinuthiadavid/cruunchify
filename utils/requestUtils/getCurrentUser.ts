async function getCurrentUser(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_SPOTIFY_API_BASE_URL}/v1/me`;
  try {
    const res = await(
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export default getCurrentUser;
