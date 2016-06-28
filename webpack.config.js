module.exports = {
  entry: './src/rails.js',
  output: {
    path: 'dist',
    filename: 'rails.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ],
  },
}
