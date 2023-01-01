import React, { useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

import useCrStore, { SpotifyUser } from "../store";

const dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SpotifyUser>({});
  const loaderRef = useRef(null);
  const { currentUser } = useCrStore();

  useEffect(() => {
    setIsLoading(true);
    loaderRef?.current?.continuousStart();
    if (currentUser.display_name) {
      setUser(currentUser);
      setIsLoading(false);
    }

    return () => {
      loaderRef?.current?.complete();
    };
  }, [currentUser]);

  return (
    <div>
      {isLoading ? <LoadingBar color="#33FF7A" ref={loaderRef} /> : null}
      <p>dashboard</p>
      <p>{user.country}</p>
      <p>{user.display_name}</p>
    </div>
  );
};

export default dashboard;
