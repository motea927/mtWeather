const config =  require('../config/config')
const line = require('@line/bot-sdk')
const weather = require('../weather/weather')
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
        "type": "flex",
        "altText": "This is a Flex Message",
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
                "text": "台北市中正區",
                "weight": "bold",
                "size": "lg",
                "margin": "md"
              },
              {
                "type": "text",
                "text": "小雨持續至明晚。",
                "size": "sm",
                "color": "#9c9c9c",
                "margin": "md"
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
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "17:00",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "23°C",
                        "wrap": true,
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "50%"
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
                        "text": "18:00",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "24°C",
                        "wrap": true,
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "50%"
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
                        "text": "19:00",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "26°C",
                        "wrap": true,
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "50%"
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
                        "text": "20:00",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "28°C",
                        "wrap": true,
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "50%"
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
                        "text": "21:00",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "35°C",
                        "wrap": true,
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": "50%"
                      }
                    ]
                  }
                ]
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