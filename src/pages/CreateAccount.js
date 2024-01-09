import React, { useState } from "react";
import { Link } from "react-router-dom";

import ImageLight from "../assets/img/create-account-office.jpeg";
import ImageDark from "../assets/img/create-account-office-dark.jpeg";

import { Input, Label, Button, HelperText } from "@windmill/react-ui";
import { useGlobalContext } from "../context/GlobalContext";
import { auth, db } from "../utils/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginUser, userName } from "../app/features/auth/authSlice";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function CreateAccount() {
  const dispatch = useDispatch();

  // get data from context
  const { notification, setnotification, loading, setloading } =
    useGlobalContext();

  // firstName state
  const [firstName, setfirstName] = useState("");

  // lastName state
  const [lastName, setlastName] = useState("");

  // email state
  const [email, setemail] = useState("");

  // password state
  const [password, setpassword] = useState("");

  // password state
  const [cpassword, setcpassword] = useState("");

  // handle login
  const handleSignUp = async () => {
    if (password !== cpassword) {
      setnotification("Passwords do not match");
    } else if (email && password && cpassword && firstName && lastName) {
      setloading(true);

      const trimmedfirstName = firstName.trim();
      const trimmedlastName = lastName.trim();
      const trimmedemail = email.trim();
      const trimmedpassword = password.trim();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          trimmedemail,
          trimmedpassword
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: `${trimmedfirstName} ${trimmedlastName}`,
        });

        await addDoc(collection(db, "users"), {
          firstName: trimmedfirstName,
          lastName: trimmedlastName,
          email: trimmedemail,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });

        dispatch(loginUser(user.uid));
        dispatch(userName(user.displayName));

        setnotification("Account Created Successfully");
        window.location.href = "/login";
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
                Create account
              </h1>
              <Label>
                <span>First Name</span>
                <Input
                  className="mt-1"
                  type="text"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                  placeholder="aisha"
                />
              </Label>
              <Label>
                <span>Last Name</span>
                <Input
                  className="mt-1"
                  type="text"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  placeholder="bankole"
                />
              </Label>
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
                  placeholder="***************"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input
                  className="mt-1"
                  placeholder="***************"
                  type="password"
                  value={cpassword}
                  onChange={(e) => setcpassword(e.target.value)}
                />
              </Label>

              {/* <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label> */}

              <Button
                onClick={handleSignUp}
                // tag={Link}
                // to="/login"
                disabled={loading}
                block
                className="mt-4"
              >
                {loading ? <div class="lds-dual-ring"></div> : "Create account"}
              </Button>

              <div className="py-3 h-5">
                <HelperText valid={false}>{notification}</HelperText>
              </div>

              {/* <hr className="my-8" />

              <Button block layout="outline">
                <GithubIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Github
              </Button>
              <Button block className="mt-4" layout="outline">
                <TwitterIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p> */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
