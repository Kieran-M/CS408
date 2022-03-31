import React from "react";
import { useNavigate } from "react-router";
import { useSignOut, useAuthUser } from "react-auth-kit";
import { fetchToken as isAuth } from "../Auth";
const LogoutButton = (props) => {
  const navigate = useNavigate();
  //const signOut = useSignOut();
  const authUser = useAuthUser();
  const signOut = () => {
    localStorage.clear();
    localStorage.removeItem("_auth_state");
    localStorage.removeItem("_auth_storage");
    localStorage.removeItem("_auth_type");
    //If we are on a coins page then its okay to stay
    if (window.location.toString().includes("/coin")) {
      window.location.reload();
    } else {
      navigate("/");
      window.location.reload();
    }
  };
  return (
    <button
      class="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
      onClick={() => signOut()}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
