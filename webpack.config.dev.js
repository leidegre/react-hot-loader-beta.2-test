'use strict'

const webpack = require('webpack')
const utils = require('./webpack.config.utils')

// Base our dev config on the prod config.
const dev = utils.cloneDeep(require('./webpack.config.prod'))

// Preprend the following entry points for our bundle.
const entry = [
  'react-hot-loader/patch',
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client'
]
dev.entry = entry.concat(dev.entry)

// Replace the DefinePlugin with a configuration for development builds.
utils.replacePlugin(dev, webpack.DefinePlugin, new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  }
}))

// Replace the uglification plugin (minification would make source debugging a mess).
utils.removePlugin(dev, webpack.optimize.UglifyJsPlugin)

// Enable HMR
dev.plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = dev