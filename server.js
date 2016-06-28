'use strict'

const path = require('path')
const express = require('express')
const server = require('./server/index')

const app = express()

app.use('/static', express.static(path.join(__dirname, 'dist')))

server.init(app)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Support grabbing port from env (for example, IIS node)
var port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log(`Listening at http://0.0.0.0:${port}`)
})
