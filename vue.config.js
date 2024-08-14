const path = require('path-browserify');
const os = require('os-browserify/browser');

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      fallback: {
        // "fs": false,
        // "path": path,
        // "os": os
      }
    }
  },
  devServer: {
    // host: "132.72.65.211"
    host: "localhost"
  }
  // publicPath: process.env.NODE_ENV === "production" ? "/LAB12/" : "/"
};
