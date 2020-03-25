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
  let replyMessage = {
    type: 'text',
    text: `Hello World! ${userMessage.text}`
  }
  switch (userMessage.text) {
    case '我的位置':
      replyMessage = {
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "cameraRoll",
                "label": "Send photo"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "camera",
                "label": "Open camera"
              }
            }
          ]
        }
      }
      break;
  }
  client.replyMessage(replyToken, replyMessage)
})

app.listen(process.env.PORT || 8080)