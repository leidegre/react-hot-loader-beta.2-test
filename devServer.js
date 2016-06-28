'use strict'

const path = require('path')
const express = require('express')
const server = require('./server/index')
const webpack = require('webpack')
const config = require('./webpack.config.dev')

const app = express()
const compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler));

server.init(app)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3000, 'localhost', function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('Listening at http://localhost:3000')
})
