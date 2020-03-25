const express = require('express')
const line = require('@line/bot-sdk')
const middleware = line.middleware

const app = express()

let config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
if (!config.channelAccessToken) config = require('./line-key-config')

const client = new line.Client({
  channelAccessToken: config.channelAccessToken
});

app.post('/webhook', middleware(config), (req, res) => {
  const userMessage = req.body.events[0].message
  const replyToken = req.body.events[0].replyToken
  console.log(`events`)
  console.log(req.body.events)
  // res.json(req.body.events)
  const replyMessage = {
    type: 'text',
    text: `Hello World! ${req.body.events[0].message.text}`
  }
  client.replyMessage(replyToken, replyMessage)
})

app.listen(process.env.PORT || 8080)