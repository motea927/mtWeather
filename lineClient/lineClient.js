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
    if (weatherResult.currently.icon === 'partly-cloudy-day' || weatherResult.currently.icon === 'partly-cloudy-night') {
      weatherResult.currently.icon = 'cloudy'
    }
    const weatherData = [
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
    weatherResult.hourly.data.forEach(el => {
      weatherData.push(
        {
          "type": "box",
          "layout": "baseline",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": `${el.time}`,
              "size": "sm"
            },
            {
              "type": "text",
              "text": `${el.temperature} °C`,
              "size": "sm"
            },
            {
              "type": "text",
              "text": `${Math.round(el.precipProbability * 1000)} %`
            }
          ]
        }
      )
    })
    const replyMessage = [
      {
        "type": "flex",
        "altText": "未來六小時天氣",
        // contents
        "contents": {
          "type": "bubble",
          "hero": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "image",
                "url": `https://mt-weather.herokuapp.com/static/${weatherResult.currently.icon}.png`,
                "align": "end",
                "offsetEnd": "15px",
                "offsetTop": "15px",
                "size": "sm"
              },
              {
                "type": "text",
                "text": `${weatherResult.currently.temperature} °C`,
                "color": "#B8B8B8",
                "size": "xxl",
                "offsetStart": "25px",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `${weatherResult.currently.summary}`,
                "color": "#d2d2d2",
                "size": "lg",
                "offsetStart": "25px"
              }
            ],
            "height": "150px"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": address,
                "weight": "bold",
                "size": "lg",
                "margin": "md"
              },
              {
                "type": "text",
                "text": `${weatherResult.hourly.summary}`,
                "size": "sm",
                "color": "#9c9c9c",
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": weatherData
              }
            ]
          },
          "styles": {
            "hero": {
              "backgroundColor": "#FFFFFF33"
            },
            "body": {
              "backgroundColor": "#FFFFFF33"
            }
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