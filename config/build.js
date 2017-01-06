var fs = require('fs')
var banner = require('./banner')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var chalk = require('chalk')
var pack = require('../package.json')

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup']
    })
  ]
})
.then(function (bundle) {
  return write('dist/' + pack.name + '.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code)
})
// Standalone Dev Build
.then(function () {
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: ['es2015-rollup']
      })
    ]
  })
  .then(function (bundle) {
    return write('dist/' + pack.name + '.js', bundle.generate({
      format: 'umd',
      moduleName: classify(pack.name),
      banner: banner
    }).code)
  })
})
.then(function () {
  // Standalone Production Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: ['es2015-rollup']
      })
    ]
  })
  .then(function (bundle) {
    var code = bundle.generate({
      format: 'umd',
      moduleName: classify(pack.name)
    }).code
    var minified = banner + '\n' + uglify.minify(code, {
      fromString: true
    }).code
    return write('dist/' + pack.name + '.min.js', minified)
  })
})
.catch(logError)

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log('\n' + chalk.green.bold(dest) + ' ' + getSize(code) + '\n')
      resolve()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}
