// adapted from https://github.com/pmndrs/zustand
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import CryptoJS from "crypto-js";

interface CrAccessTokenData {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
}

interface SpotifyUser {
  country?: string;
  display_name?: string;
  email?: string;
  followers?: {
    href: string;
    total: number;
  };
  images?: Array<{ url: string; height: number; width: number }>;
  type?: string;
  uri?: string;
  product?: string;
  href?: string;
  id?: string;
  external_urls?: any;
}

// crunchify state
interface CrState {
  accessTokenData: CrAccessTokenData;
  setAccessTknData: (payload: CrAccessTokenData) => void;
  currentUser: SpotifyUser;
  setCurrentUser: (payload: SpotifyUser) => void;
}

const useCrStore = create<CrState>()(
  devtools(
    persist(
      (set) => ({
        accessTokenData: {},
        currentUser: {},
        setAccessTknData: (payload) =>
          set((state) => ({
            accessTokenData: {
              ...state.accessTokenData,
              accessToken: CryptoJS.AES.encrypt(
                payload.accessToken!,
                process.env.NEXT_PUBLIC_ENC_SECRET_KEY!
              ).toString(),
              refreshToken: CryptoJS.AES.encrypt(
                payload.refreshToken!,
                process.env.NEXT_PUBLIC_ENC_SECRET_KEY!
              ).toString(),
            },
          })),
        setCurrentUser: (payload) => set((state) => ({ currentUser: payload })),
      }),
      {
        name: "crunchify-store",
      }
    )
  )
);

export default useCrStore;
export type { CrAccessTokenData, SpotifyUser };
