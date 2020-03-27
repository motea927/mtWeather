const config =  require('../config/config')
const line = require('@line/bot-sdk')
const weather = require('../weather/weather')
const client = new line.Client({
  channelAccessToken: config.channelAccessToken
})
let replyMessage
const lineClient = {
  sendLocationList (replyToken) {
    const bubbleMessage = {
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
            "text": "Brown Cafe",
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "baseline",
            "margin": "md",
            "contents": [
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
              },
              {
                "type": "text",
                "text": "4.0",
                "size": "sm",
                "color": "#999999",
                "margin": "md",
                "flex": 0
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Place",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Time",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "10:00 - 23:00",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "CALL",
              "uri": "https://linecorp.com"
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "WEBSITE",
              "uri": "https://linecorp.com"
            }
          },
          {
            "type": "spacer",
            "size": "sm"
          }
        ],
        "flex": 0
      }
    }
    const replyMessage = [ 
      {
        "type": "flex",
        "altText": "未來六小時天氣",
        // contents
        "contents": {
          "type": "carousel",
          "contents": [
            bubbleMessage
          ]
        }
        // contents end
      }
    ]
    client.replyMessage(replyToken, replyMessage)
  },
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
    const weatherTitle = {
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
    const finallyData = {'hourly': null, 'daily': null}
    Object.keys(finallyData).forEach(keys => {
      console.log(keys)
      const weatherData = [
        weatherTitle
      ]
      weatherResult[keys].data.forEach(el => {
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
                "text": `${Math.round(el.precipProbability * 100)} %`
              }
            ]
          }
        )
      })
      // 
      const bubbleMessage = {
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
              "text": `${weatherResult[keys].summary}`,
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
        }
      }
      finallyData[keys] = bubbleMessage
    })
    const replyMessage = [ 
      {
        "type": "flex",
        "altText": "未來六小時天氣",
        // contents
        "contents": {
          "type": "carousel",
          "contents": [
            finallyData['hourly'],
            finallyData['daily'],
          ]
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
      text: `"${text}" ? 我看不懂耶，不過草泥馬馬會咩咩咩喔! 🦙🦙🦙`
    }
    client.replyMessage(replyToken, replyMessage)
  }
}

module.exports = lineClient