import config from "./config";
import React from "react";
import Main from "./Components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "react-dom";
import {
  AuthenticationProvider,
  getUserManager,
  oidcLog,
  OidcSecure
} from "@procter-gamble/pg-react-auth";
import Amplify from "aws-amplify";
import GoogleAnalytics from "react-ga";

// Initialize Google analytics
// GoogleAnalytics.initialize("UA-123456789-0");

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "mypgs-training-2",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
        custom_header: async () => {
          var authorization =
            process.env.REACT_APP_STAGE !== "production" &&
              process.env.REACT_APP_STAGE !== "non-prod"
              ? (await getUserManager().getUser()).access_token
              : "undefined";
          return {
            Authorization: authorization
          };
        }
      }
    ]
  }
});

const Wrapper = () => (
  <Router>
    {process.env.NODE_ENV !== "production" &&(
        <AuthenticationProvider
          configuration={config.pingfed}
          loggerLevel={oidcLog.WARN}
        >
          <OidcSecure>
            <Main />
            {/* If in a testing environment add dummy input for testing to hit */}
            {/* This is needed so testing can reference the same input on our page and ping "username" */}
            <input id="username" className="d-none" data-cy="testing"></input>
          </OidcSecure>
        </AuthenticationProvider>
      )}
    {process.env.NODE_ENV === "production" && <Main />}
  </Router>
);

render(<Wrapper />, document.getElementById("root"));
