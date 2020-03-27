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
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "cover",
        "action": {
          "type": "uri",
          "uri": "http://linecorp.com/"
        },
        "url": "https://www.travel.taipei/image/64607/1024x768"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "北部地區",
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "text",
            "text": "北北基彰中桃苗",
            "size": "sm",
            "offsetStart": "1px",
            "color": "#707070"
          }
        ],
        "borderColor": "#33333333",
        "borderWidth": "1px"
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
              "type": "postback",
              "label": "hello",
              "data": "hello",
              "displayText": "hello"
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "postback",
              "label": "hello",
              "data": "hello",
              "displayText": "hello"
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "postback",
              "label": "hello",
              "data": "hello",
              "displayText": "hello"
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "postback",
              "label": "hello",
              "data": "hello",
              "displayText": "hello"
            }
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