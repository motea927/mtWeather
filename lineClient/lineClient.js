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
              "text": `${Math.round(el.precipProbability * 100)} %`
            }
          ]
        }
      )
    })
    /*
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
          }
        }
        // contents end
      }
    ]
    */
    const replyMessage = {
      "type": "carousel",
      "contents": [
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "320:213"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Brown Cafe",
                "weight": "bold",
                "size": "sm",
                "wrap": true
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "xs",
                    "color": "#8c8c8c",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "東京旅行",
                        "wrap": true,
                        "color": "#8c8c8c",
                        "size": "xs",
                        "flex": 5
                      }
                    ]
                  }
                ]
              }
            ],
            "spacing": "sm",
            "paddingAll": "13px"
          },
          "size": "giga"
        },
        {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip11.jpg",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "320:213"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Brow&Cony's Restaurant",
                "weight": "bold",
                "size": "sm",
                "wrap": true
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "sm",
                    "color": "#8c8c8c",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "東京旅行",
                        "wrap": true,
                        "color": "#8c8c8c",
                        "size": "xs",
                        "flex": 5
                      }
                    ]
                  }
                ]
              }
            ],
            "spacing": "sm",
            "paddingAll": "13px"
          },
          "size": "giga"
        },
        {
          "type": "bubble",
          "size": "giga",
          "hero": {
            "type": "image",
            "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip12.jpg",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "320:213"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Tata",
                "weight": "bold",
                "size": "sm"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "icon",
                    "size": "xs",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "4.0",
                    "size": "sm",
                    "color": "#8c8c8c",
                    "margin": "md",
                    "flex": 0
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "東京旅行",
                        "wrap": true,
                        "color": "#8c8c8c",
                        "size": "xs",
                        "flex": 5
                      }
                    ]
                  }
                ]
              }
            ],
            "spacing": "sm",
            "paddingAll": "13px"
          }
        }
      ]
    }
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