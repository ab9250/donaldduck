"use strict";

module.exports.lambda_handler = function (event, context, callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };

  callback(null, response);
};
