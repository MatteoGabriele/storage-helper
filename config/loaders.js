module.exports = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    query: {
      retainLines: true,
      presets: ['es2015']
    },
    exclude: /node_modules/
  }
]
