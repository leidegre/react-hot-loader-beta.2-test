#!/usr/bin/env node

'use strict'

var fs = require('fs')

var userInput = {}

var defaults = {
  scripts: {
    'noop': 'echo "Nothing to see here, move along."',
    'clean:babel': 'rimraf lib',
    'clean:webpack': 'rimraf dist',
    'build:babel': 'cross-env NODE_ENV=production babel app --out-dir lib',
    'build:webpack': 'cross-env NODE_ENV=production webpack --config webpack.config.prod.js',
    'start': 'node devServer.js',
    'start-watch': 'nodemon devServer.js --watch devServer.js --watch webpack.config.dev.js'
  },
  packages: {
    react: [
      'react',
      'react-dom'
    ],
    router: [
      'react-router',
      'react-router-redux'
    ],
    redux: [
      'immutable',
      'react-redux',
      'redux',
      'redux-thunk',
      'reselect'
    ],
    bootstrap: [
      'jquery',
      'bootstrap',
      'bootstrap-webpack',
      'css-loader',
      'less-loader',
      'style-loader',
      'imports-loader',
      'exports-loader',
      'extract-text-webpack-plugin',
      'expose-loader',
      'file-loader',
      'url-loader'
    ],
    website: {
      dependencies: [
        'express',
        'body-parser'
      ],
    },
    devDependencies: [
      'any-promise',
      'babel-cli',
      'babel-core',
      'babel-loader',
      'babel-preset-es2015',
      'babel-preset-es2015-loose',
      'babel-preset-react',
      'babel-preset-stage-0',
      'bluebird', 
      'cross-env',
      'eslint',
      'eslint-plugin-react',
      'express',
      'react-hot-loader@3.0.0-beta.2',
      'rimraf',
      'webpack',
      'webpack-dev-middleware',
      'webpack-hot-middleware'
    ]
  }
}

// Process execution order
var stepIndex = 0
var steps = [
  step_userInput,
  step_fixPackage,
  step_npmInstall,
  function() {
    console.log('done')
  }
]
function process_moveNext() {
  process.nextTick((i) => {
    if (stepIndex < steps.length) {
      steps[stepIndex++]()
    }
  })
}

function exec(command, callback) {
  var child_process = require('child_process')
  var child = child_process.exec(command, (err) => {
    if (err) return console.error(err) // opt-out
    callback(err)
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

function step_userInput() {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log('NOTE: see README.md for setup instructions...')

  try {
    fs.accessSync('package.json', fs.W_OK)
  } catch (err) {
    console.error(err.message)
    console.error('Did you forget to run npm init?')
    process.exit(1)
    return
  }

  function autoComplete(partial, suggestions) {
    var ans = suggestions.filter((x) => x.startsWith(partial))
    if (ans.length === 1) {
      return ans[0]
    }
    if (ans.length > 1) {
      console.error(`Could you be more specific ${ans.join(', ')}?`)
    } else {
      console.error('Sorry, I don\'t understand.')
    }
    process.exit(1)
  }

  rl.question('Are you building a website? ', (ans) => {
    userInput.website = autoComplete(ans, ['yes', 'no'])

    rl.question('Do you wanna use redux? ', (ans) => {
      userInput.redux = autoComplete(ans, ['yes', 'no'])

      rl.question('Do you wanna use react-router? ', (ans) => {
        userInput.router = autoComplete(ans, ['yes', 'no'])

        rl.question('Do you wanna use bootstrap? ', (ans) => {
          userInput.bootstrap = autoComplete(ans, ['yes', 'no'])

          rl.close()

          process_moveNext()
        })
      })
    })
  })
}

function step_fixPackage() {
  fs.readFile('package.json', 'utf-8', (err, text) => {
    if (err) return console.error(err)
    var pkg = JSON.parse(text)
    switch (userInput.website) {
      case 'no': {
        var scripts = pkg.scripts || {}
        Object.assign(scripts, defaults.scripts)
        scripts['clean'] = 'npm run clean:babel'
        scripts['build'] = 'npm run clean && npm run build:babel'
        pkg.scripts = scripts
        break
      }
      case 'yes': {
        var scripts = pkg.scripts || {}
        Object.assign(scripts, defaults.scripts)
        scripts['clean'] = 'npm run clean:webpack'
        scripts['build'] = 'npm run clean && npm run build:webpack'
        pkg.scripts = scripts
        break
      }
    }
    fs.writeFile('package.json', JSON.stringify(pkg, null, 2), 'utf-8', (err) => {
      if (err) return console.error(err)

      process_moveNext()
    })
  })
}

function step_npmInstall() {
  var installTheseDependencies = []
    .concat(userInput.website === 'yes' ? defaults.packages.website.dependencies : [])

  installTheseDependencies.sort((a, b) => a.localeCompare(b))

  var installTheseDevDependencies = []
    .concat(defaults.packages.devDependencies)
    .concat(defaults.packages.react)
    .concat(userInput.redux === 'yes' ? defaults.packages.redux : [])
    .concat(userInput.router === 'yes' ? defaults.packages.router : [])
    .concat(userInput.bootstrap === 'yes' ? defaults.packages.bootstrap : [])

  installTheseDevDependencies.sort((a, b) => a.localeCompare(b))
  
  // drop dependencies from devDependencies
  installTheseDependencies.forEach((dep) => {
    var i
    i = installTheseDevDependencies.indexOf(dep)
    if (i !== -1) {
      installTheseDevDependencies.splice(i, 1)
    }
  })

  // https://github.com/npm/npm/issues/11283
  exec('npm set progress=false', (err) => {
    if (err) return console.error(err)
    console.log('npm install... (this could take a while)')

    function installDevDependencies() {
      exec(`npm install ${installTheseDevDependencies.join(' ')} --save-dev`, (err) => {
        if (err) return console.error(err)

        process_moveNext()
      })
    }

    function installDependencies() {
      if (installTheseDependencies.length > 0) {
        exec(`npm install ${installTheseDependencies.join(' ')} --save`, (err) => {
          if (err) return console.error(err)

          installDevDependencies()
        })
      } else {
        installDevDependencies()
      }
    }

    installDependencies()
  })
}

process_moveNext()
