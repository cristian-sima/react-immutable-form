var webpack = require('webpack')
var env = process.env.NODE_ENV

var config = {
  module: {
    rules: [
      {
        test    : /\.(j|t)s(x)?$/u,
        exclude : /node_modules/u,
        use     : {
          loader: "ts-loader",
        },
      },

      {
        test : /\.scss$/u,
        use  : ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test : /\.css$/u,
        use  : ["style-loader", "css-loader"],
      },
      {

        test : /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/ui,
        type : "asset/resource",
      },
    ],
  },
  resolve: {
    // alias: {
    //   "react-loadable":"@docusaurus/react-loadable",
    // },
    extensions: [".js", ".json", ".ts", ".tsx"],
    modules: [
      "node_modules",
    ],
  },
  output: {
    library: 'ReactPaginator',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development"),
      },
    }),
  ],
}

if (env === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "BABEL_ENV": JSON.stringify("production"),
      },
    }),
  )
}

module.exports = config
