// Setup config for dev and prod, env var automatically switches:
// npm start == development   npm run-script build == production
let config = {};
if (process.env.NODE_ENV === "production") {
  // Prod
  config = {
    apiGateway: {
      REGION: "us-east-1",
      URL: `https://api.${process.env.REACT_APP_DOMAIN}/dev`,
    },
    pingfed: {
      client_id: "AWSServerlessTest",
      redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/authentication/callback`,
      response_type: "code",
      post_logout_redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/`,
      scope: "openid profile email",
      authority: "https://fedauthtst.pg.com",
      silent_redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/authentication/silent_callback`,
      automaticSilentRenew: true,
      loadUserInfo: false,
      triggerAuthFlow: true,
      extraQueryParams: { pfidpadapterid: "OAuth" },
    },
  };
} else if (process.env.REACT_APP_STAGE === "non-prod") {
  // Non-Prod
  config = {
    apiGateway: {
      REGION: "us-east-1",
      URL: `https://api.${process.env.REACT_APP_DOMAIN}/non-prod`,
    },
    pingfed: {
      client_id: "iam_group_reporting",
      redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/authentication/callback`,
      response_type: "code",
      post_logout_redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/`,
      scope: "openid profile email",
      authority: "https://fedauthtst.pg.com",
      silent_redirect_uri: `https://${process.env.REACT_APP_DOMAIN}/authentication/silent_callback`,
      automaticSilentRenew: true,
      loadUserInfo: false,
      triggerAuthFlow: true,
      extraQueryParams: { pfidpadapterid: "ExcludeEBPAdapters" },
    },
  };
} else {
  // Dev
  config = {
    apiGateway: {
      REGION: "us-east-1",
      URL: `${process.env.REACT_APP_LOCAL_API}`,
    },
    pingfed: {
      client_id: "AWSServerlessTest",
      redirect_uri: "http://localhost:3000/authentication/callback",
      response_type: "code",
      post_logout_redirect_uri: "http://localhost:3000/",
      scope: "openid profile email",
      authority: "https://fedauthtst.pg.com",
      silent_redirect_uri:
        "http://localhost:3000/authentication/silent_callback",
      automaticSilentRenew: true,
      loadUserInfo: false,
      triggerAuthFlow: true,
      extraQueryParams: { pfidpadapterid: "OAuth" },
    },
  };
}

export default config;
