import React from "react";
import { route } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Spinner from "./Spinner";

const PrivateRoute = ({children, redirectTo}) => {
  const {  isAuthenticated } = useAuth0();
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };

export default PrivateRoute;
