import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchToken as isAuth } from "../Auth";

const LoginButton = (props) => {
  const navigate = useNavigate();
  return(
    <button
      className="w-full py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
      onClick={() => navigate("/login")}
    >
      Log in
    </button>
  )
};

export default LoginButton;
