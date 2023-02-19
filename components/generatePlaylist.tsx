import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import createPlaylist, {
  PlaylistPayload,
} from "../utils/requestUtils/createPlaylist";
import useCrStore from "../store";
import updatePlaylist from "../utils/requestUtils/updatePlaylist";
import CrDialog from "./CrDialog";

interface createPlaylistPayloadProps {
  name: string;
  description: string;
  collaborative: boolean;
  public: boolean;
}

interface GeneratePlaylistProps {
  createPlaylistPayload: createPlaylistPayloadProps;
  URIs: Array<string>;
}

const GeneratePlaylist = ({
  createPlaylistPayload,
  URIs,
}: GeneratePlaylistProps) => {
  // component state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalErr, setIsModalErr] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState<{
    id?: string;
    href?: string;
    uri?: string;
    externalUrl?: string;
  }>({});

  // access auth state
  const {
    accessTokenData: { accessToken, refreshToken },
    setAccessTknData,
    currentUser,
  } = useCrStore();

  // mutation to create a playlist
  const createPlaylistMutation = useMutation({
    mutationFn: (payload: PlaylistPayload) =>
      createPlaylist(accessToken!, currentUser?.id!, payload),
  });

  // mutation to update a playlist
  const updatePlaylistMutation = useMutation({
    mutationFn: ({
      uris,
      playlistId,
    }: {
      uris: Array<string>;
      playlistId: string;
    }) => updatePlaylist(accessToken!, playlistId, uris),
  });

  // function to generate a playlist
  function handleGeneratePlaylist() {
    createPlaylistMutation.mutate(createPlaylistPayload, {
      onSuccess: (data, variables, context) => {
        // update state
        // this will be important when showing the success modal
        setCreatedPlaylist({
          id: data.id,
          href: data.href,
          uri: data.uri,
          externalUrl: data.external_urls.spotify,
        });

        // update the created playlist
        updatePlaylistMutation.mutate(
          { uris: URIs, playlistId: data.id },
          {
            onSuccess: (data, variables, _) => {
              setIsModalOpen(true);
            },
            onError: (error, variables, _) => {
              setIsModalErr(true);
            },
          }
        );
      },
      onError: (error, variables, context) => {
        setIsModalErr(true);
      },
    });
  }

  function onModalClose() {
    setIsModalErr(false);
    setIsModalOpen(false);
  }

  function openPlaylistInSpotify() {
    window.open(createdPlaylist.externalUrl, "_blank");
    onModalClose();
  }

  return (
    <>
      <button
        className="btn-primary font-semibold"
        onClick={handleGeneratePlaylist}
      >
        <Image
          src="/icons/Playlist.png"
          height={30}
          width={30}
          alt="icon: cruunchify logo"
        />
        Generate Playlist
      </button>

      <CrDialog isOpen={isModalOpen} onModalClose={onModalClose}>
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-5 items-center">
            <i
              className={`text-3xl ${
                isModalErr
                  ? "fa-solid fa-triangle-exclamation text-red-600"
                  : "fa-regular fa-circle-check text-cr-green"
              } `}
            ></i>
            <p className={`font-semibold text-3xl text-cr-green`}>
              {isModalErr ? "Oops! That didn't work." : "Success"}
            </p>
          </div>
          <p className="text-xl">
            {isModalErr
              ? "Something went wrong while creating your playlist. Please try again"
              : "Your playlist was created successfully"}
          </p>
          <button
            className="btn-primary mt-5 hover:bg-cr-modal"
            onClick={
              isModalErr ? handleGeneratePlaylist : openPlaylistInSpotify
            }
          >
            {isModalErr ? "Re-Try" : "Open In Spotify"}
          </button>
        </div>
      </CrDialog>
    </>
  );
};

export default GeneratePlaylist;
