import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

import useCrStore from "../store";

const dashboard = () => {
  const accessTknData = useCrStore((state) => state.accessTokenData);
  const [accessTkn, setAccessTkn] = useState<string>("");

  useEffect(() => {
    const encryptedAccessTkn = accessTknData.accessToken;
    const decryptedAccessTkn = CryptoJS.AES.decrypt(
      encryptedAccessTkn!,
      process.env.NEXT_PUBLIC_ENC_SECRET_KEY!
    ).toString(CryptoJS.enc.Utf8);
    setAccessTkn(decryptedAccessTkn);
  }, [accessTknData]);

  return (
    <div>
      <p>dashboard</p>
      <pre>{accessTkn}</pre>
    </div>
  );
};

export default dashboard;
