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

// crunchify state
interface CrState {
  accessTokenData: CrAccessTokenData;
  setAccessTknData: (payload: CrAccessTokenData) => void;
  currentUser: any;
  setCurrentUser: (payload: any) => void;
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
        setCurrentUser: (payload) => set({ currentUser: payload }),
      }),
      {
        name: "crunchify-store",
      }
    )
  )
);

export default useCrStore;
export type { CrAccessTokenData };
