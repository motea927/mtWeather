const express = require('express')
const middleware = require('@line/bot-sdk').middleware

const app = express()

const config = require('./line-key-config.js')

app.post('/webhook', middleware(config), (req, res) => {
  console.log(req.body.events) // webhook event objects
  console.log(req.body.destination) // user ID of the bot (optional)
})

app.listen(process.env.PORT || 8080)