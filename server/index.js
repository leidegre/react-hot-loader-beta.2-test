'use strict'

const express = require('express')
const bodyParser = require('body-parser')

function init(app) {
  app.use(bodyParser.json())

  const newRouter = express.Router()
  newRouter.get('/hello', (req, res) => {
    res.json({
      text: 'good day!'
    })
  })

  app.use('/api', newRouter)
}

module.exports = {
  init
}