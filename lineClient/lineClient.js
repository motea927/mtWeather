const config =  require('../config/config')
const line = require('@line/bot-sdk')
const weather = require('../weather/weather')
const client = new line.Client({
  channelAccessToken: config.channelAccessToken
})
let replyMessage
const lineClient = {
  async sendWeatherMessage (lat, lng, replyToken, address) {
    const re = /區|鎮|鄉|市/g
    if (address.match(re)) {
      addressEndIndex = address.lastIndexOf(address.match(re).pop())
      address = address.slice(0, addressEndIndex + 1)
    }
    
    const weatherResult = await weather.getWeather(lat, lng)
    const data = [
      {
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "時間",
            "size": "md",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "溫度",
            "size": "md",
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "降雨機率",
            "size": "md",
            "weight": "bold"
          }
        ]
      }
    ]
    weatherResult.hourlyDataArr.forEach(element => {
      data.push({
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": `${element.time}`,
            "size": "sm"
          },
          {
            "type": "text",
            "text": `${element.temperature} °C`,
            "wrap": true,
            "size": "sm"
          },
          {
            "type": "text",
            "text": `${Math.round(element.precipProbability * 100)}%`
          }
        ]
      })
    });
    const replyMessage = [
      {
        "type": "flex",
        "altText": "未來六小時天氣",
        // contents
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": "http://linecorp.com/"
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": `${address}`,
                "weight": "bold",
                "size": "lg",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `${weatherResult.summary}`,
                "size": "sm",
                "color": "#9c9c9c",
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": data
              }
            ]
          }
        }
        // contents end
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