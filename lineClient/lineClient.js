const config =  require('../config/config')
const line = require('@line/bot-sdk')
const client = new line.Client({
  channelAccessToken: config.channelAccessToken
})
let replyMessage
const lineClient = {
  sendWeatherMessage (replyToken, text) {
    replyMessage = [
      {
      type: 'text',
      text: text
      },
      {
        "type": "bubble", // ①
        "body": { // ②
          "type": "box", // ③
          "layout": "horizontal",　// ④
          "contents": [ // ⑤
            {
              "type": "text", // ⑥
              "text": "Hello,"
            },
            {
              "type": "text", // ⑥
              "text": "World!"
            }
          ]
        }
      }
  ]
    client.replyMessage(replyToken, replyMessage)
  },
  sendLocationBtn (replyToken) {
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
    client.replyMessage(replyToken, replyMessage)
  },
  sendText (replyToken, text) {
    replyMessage = {
      type: 'text',
      text: text
    }
    client.replyMessage(replyToken, replyMessage)
  }
}

module.exports = lineClient