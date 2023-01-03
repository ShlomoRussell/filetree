const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./src/app/"),
  output: {
    path: path.resolve(__dirname, "build"),
    assetModuleFilename: "icons/[name][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Code Editor",
      filename: "index.html",
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
    new webpack.EnvironmentPlugin(['baseUrl']),
  ],
};
