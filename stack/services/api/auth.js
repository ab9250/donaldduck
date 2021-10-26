"use strict";
const auth = require("@procter-gamble/pg-ping-auth");

var clientId = process.env.PingClientID;
var domain = process.env.Domain;

var groups =
  process.env.AccessGroup === undefined
    ? []
    : process.env.AccessGroup.split(",");
var attributeMap =
  process.env.AttributeMap === undefined
    ? {}
    : JSON.parse(process.env.AttributeMap);
var groupAttributes =
  process.env.GroupAttributes === undefined
    ? {}
    : JSON.parse(process.env.GroupAttributes);

var usingCookie =
  process.env.COOKIE_AUTH !== undefined && process.env.COOKIE_AUTH !== "false";

var config = {
  usingCookie,
  domain,
  clientId,
  attributeMap,
  groups,
  groupAttributes,
};

module.exports.lambda_handler = function (event, context, callback) {
  auth.lambdaAuthorizer(config, event, callback);
};
