import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";

import { useSelector } from "react-redux";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));

function App() {
  // get current user from redux
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />

          <Route path="/create-account" component={CreateAccount} />
          {/* <Route path="/forgot-password" component={ForgotPassword} /> */}

          {/* Protected route */}
          {currentUser ? (
            <Route path="/app/" component={Layout} />
          ) : (
            <Route
              path="/login"
              element={() => {
                window.location.href = "/login";
                return null;
              }}
            />
          )}

          {/* If you have an index page, you can remothis Redirect */}
          <Redirect exact from="/" to="/login" />

          <Route path="*" component={Login} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
