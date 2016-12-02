module.exports = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    query: {
      retainLines: true,
      plugins: ['transform-runtime'],
      presets: ['es2015']
    },
    exclude: /node_modules/
  }
]
