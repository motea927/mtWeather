const express = require('express')
const middleware = require('@line/bot-sdk').middleware

const app = express()

let config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
if (!config.channelAccessToken) config = require('./line-key-config')

app.post('/webhook', middleware(config), (req, res) => {
  console.log(req.body.events)
  console.log(req.body.destination)
  res.json(req.body.events)
})

app.listen(process.env.PORT || 8080)