const express = require('express')
const line = require('@line/bot-sdk')
const weather = require('./weather/weather')
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
  console.log(req.body.events[0])
  const replyToken = req.body.events[0].replyToken
  let replyMessage = {
    type: 'text',
    text: `Hello World! ${userMessage.text}`
  }
  if (userMessage.type === 'text') {
    switch (userMessage.text) {
      case '我的GPS定位':
        replyMessage = {
          "type": "text", // ①
          "text": "請按下「傳送我的GPS定位」",
          "quickReply": { // ②
            "items": [
              {
                "type": "action", // ④
                "action": {
                  "type": "location",
                  "label": "傳送我的GPS定位"
                }
              }
            ]
          }
        }
        break;
    }
  } else if (userMessage.type === 'location') {
    replyMessage = {
      type: 'text',
      text: `Hello World! ${userMessage.address}`
    }
  }
  
  client.replyMessage(replyToken, replyMessage)
})

app.listen(process.env.PORT || 8080)