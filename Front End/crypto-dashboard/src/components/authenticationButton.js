import React from 'react';

import LoginButton from './loginButton';
import LogoutButton from './logoutButton';
import {useIsAuthenticated} from 'react-auth-kit';

const AuthenticationButton = (props) => {
  const isAuthenticated = useIsAuthenticated();
  return (localStorage.getItem("_auth") ? (<LogoutButton/>): (<LoginButton/>));
};

export default AuthenticationButton;