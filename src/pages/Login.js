import React from "react";
import { Link } from "react-router-dom";

import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { GithubIcon, TwitterIcon } from "../icons";
import { Label, Input, Button } from "@windmill/react-ui";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { HelperText } from "@windmill/react-ui";

import { auth } from "../utils/Firebase";
import { useGlobalContext } from "../context/GlobalContext";
import { loginUser, userName } from "../app/features/auth/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  // get current signed user from context
  const { notification, setnotification, loading, setloading } =
    useGlobalContext();

  const dispatch = useDispatch();

  // email state
  const [email, setemail] = useState("");

  // password state
  const [password, setpassword] = useState("");

  // handle login
  const handleSignIn = async () => {
    if (email && password) {
      setloading(true);

      const trimmedemail = email.trim();
      const trimmedpassword = password.trim();

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          trimmedemail,
          trimmedpassword
        );
        const user = userCredential.user;
        dispatch(loginUser(user.uid));
        dispatch(userName(user.displayName));

        localStorage.setItem("userId", user.uid);
        localStorage.setItem("userName", user.displayName);

        window.location.href = "/app/";
      } catch (error) {
        const errorMessage = error.message;
        console.error(error);
        setnotification(errorMessage);
      } finally {
        setloading(false);
      }
    } else {
      setnotification("All fields must be filled");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="john@doe.com"
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="***************"
                />
              </Label>

              <Button
                onClick={handleSignIn}
                className={`mt-4`}
                block
                // tag={Link}
                disabled={loading}
                // to="/app"
              >
                {loading ? <div className="lds-dual-ring"></div> : "Log in"}
              </Button>
              <div className="py-3 h-5">
                <HelperText valid={false}>{notification}</HelperText>
              </div>

              {/* <hr className="my-8" /> */}

              {/* <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button className="mt-4" block layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link>
              </p> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
