const config = {
    entry:  __dirname + '/js/index.js',
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module:{
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
};

module.exports = config;
