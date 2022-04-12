import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/navbar";
import { useSignIn } from "react-auth-kit";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import qs from "qs";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setKey] = useState("");
  const [secretKey, setSecret] = useState("");

  const navigate = useNavigate();
  const signIn = useSignIn();
  function signup(e) {
    e.preventDefault();
    if(username.length === 0 || password.length === 0 || apiKey.length === 0 || secretKey.length === 0){
      alert("Please fill in all fields");
      return;
    }
    var data = JSON.stringify({
      username: username,
      password: password,
      apikey: apiKey,
      secretkey: secretKey,
    });
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/authenticate/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        switch (response.data.code) {
          case 200:
            alert("Sign up successful");
            var data = qs.stringify({
              username: username,
              password: password,
            });
            var login = {
              method: "post",
              url: "http://127.0.0.1:8000/authenticate/token",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: data,
            };
              
            axios(login)
              .then(function (response) {
                console.log(response.data.access_token);
                var decoded = jwt_decode(response.data.access_token);
                if (response.data.access_token) {
                  if(signIn({
                    token: response.data.decoded, //Auth token
                    tokenType: "Bearer", // Token type set as Bearer
                    authState: response.data.access_token.replace(/['"]+/g, ''), // Dummy auth user state
                    expiresIn: 30,
                  })){
                    navigate("/");
                  }
                }
              })
              .catch(function (error) {
                alert(error);
              });
              break;
          case 404:
            alert("404");
            break;
          case 400:
            alert("Error : User already exists");
            break;
        }
      })
      .catch(function (error) {
        console.log(error);
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
              Sign up
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Or
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                Sign In{" "}
              </Link>
            </p>
          </div>
          <form class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email-address" class="sr-only">
                  username
                </label>
                <input
                  id="email-address"
                  name="username"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div>
                <label for="password" class="sr-only">
                  ApiKey
                </label>
                <input
                  id="binance key"
                  name="binance key"
                  type="password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="API Key"
                  value={apiKey}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
              <div>
                <label for="password" class="sr-only">
                  ApiKey
                </label>
                <input
                  id="binance skey"
                  name="binance skey"
                  type="password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                onClick={(e) => {
                  signup(e);
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
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
