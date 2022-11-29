import { useRouter } from "next/router";
import React from "react";
import { login } from "../../utils/auth";

const Login = () => {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => login(router)}>login</button>
    </div>
  );
};

export default Login;
