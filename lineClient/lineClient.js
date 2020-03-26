const config =  require('../config/config')
const line = require('@line/bot-sdk')
const weather = require('../weather/weather')
const client = new line.Client({
  channelAccessToken: config.channelAccessToken
})
let replyMessage
const lineClient = {
  async sendWeatherMessage (lat, lng, replyToken, address) {
    const weatherResult = await weather.getWeather(lat, lng)
    const replyMessage = [
      {
        "type": "flex",
        "altText": "this is a flex message",
        //123456
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "address"
              },
              {
                "type": "text",
                "text": "world"
              }
            ]
          }
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