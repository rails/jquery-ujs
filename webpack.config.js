module.exports = {
  entry: './src/rails.js',
  output: {
    path: 'dist',
    filename: 'rails.js',
  },
  module: {
    loaders: [
      // {
      //   test: /\.js$/,
      //   loader: 'babel'
      // }
    ],
  },
}
