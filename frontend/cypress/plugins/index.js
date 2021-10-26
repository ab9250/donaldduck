module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args.push("--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process");
      var path = require('path');
      var extension_path = path.resolve(__dirname, 'ignore_x_frames_headers/1.1.1_0')
      args.push(`--load-extension=${extension_path}`);
      return args;
    }
  });
};