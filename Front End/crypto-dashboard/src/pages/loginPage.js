import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/navbar";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import qs from "qs";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const navigate = useNavigate();

  var data = qs.stringify({
    username: email,
    password: password,
  });
  var config = {
    method: "post",
    url: "http://127.0.0.1:8000/authenticate/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  function login(e) {
    e.preventDefault();
    axios(config)
      .then(function (response) {
        const decoded = jwt_decode(response.data.access_token);
        console.log(response);
        if (response.data.access_token) {
          if (
            signIn({
              token: response.data.decoded, //Auth token
              tokenType: "Bearer", // Token type set as Bearer
              authState: response.data.access_token.replace(/['"]+/g, ""), // Dummy auth user state
              expiresIn: 30,
            })
          ) {
            //alert("Successful login");
            //signIn({token: response.data.token});
            /* localStorage.setItem("_auth", true);
              console.info(decoded);
              setToken(decoded);
              localStorage.setItem("apikey", decoded.sub.apikey);
              localStorage.setItem("secret", decoded.sub.secretkey);
              console.log(localStorage.getItem("secret")); */
            navigate(-1);
          }
        }
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 401:
            alert("Error logging in: Cannot find valid user");
            break;
          case 422:
            alert("Error: Please enter valid credentials");
            break;
        }
      });
  }

  return (
    <>
      <Navbar></Navbar>
      <div class="min-h-full bg-gray-1000 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <img class="mx-auto h-16  w-auto" src="logo.png" alt="Workflow" />
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Or
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                Sign Up{" "}
              </Link>
            </p>
          </div>
          <form class="mt-8 space-y-6" onSubmit={login}>
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email-address" class="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label for="password" class="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                onClick={(e) => {
                  login(e);
                }}
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
