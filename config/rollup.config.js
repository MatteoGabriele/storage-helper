import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

let pkg = require('../package.json')
let external = Object.keys(pkg.dependencies)

export default {
  entry: 'src/index.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'storageHelper',
  dest: pkg['main'],
  external: external,
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup']
    }),
    uglify()
  ]
}
