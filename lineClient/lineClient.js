const config =  require('../config/config')
const line = require('@line/bot-sdk')
const weather = require('../weather/weather')
const client = new line.Client({
  channelAccessToken: config.channelAccessToken
})
let replyMessage
const lineClient = {
  sendLocationList (replyToken) {
    // key, value
    const locationArr = [
      { 
        name: '台北市',
        icon: 'Taipei',
        location: {
          lat: 25.0420713,
          lng: 121.4616599
        }
      },
      { 
        name: '新北市',
        icon: 'NewTaipei',
        location: {
          lat: 24.9875278,
          lng: 121.364592
        }
      },
      { 
        name: '基隆市',
        icon: 'Keelung',
        location: {
          lat: 25.1241862,
          lng: 121.6475833
        }
      },
      { 
        name: '桃園市',
        icon: 'Taoyuan',
        location: {
          lat: 24.8551722,
          lng: 120.9519878
        }
      },
      { 
        name: '新竹市',
        icon: 'HsinchuCity',
        location: {
          lat: 24.7849113,
          lng: 120.8859866
        }
      },
      { 
        name: '新竹縣',
        icon: 'HsinchuCounty',
        location: {
          lat: 24.6873144,
          lng: 120.8920084
        }
      },
      { 
        name: '苗栗縣',
        icon: 'Miaoli',
        location: {
          lat: 24.5151718,
          lng: 120.6615323
        }
      },
      { 
        name: '台中市',
        icon: 'Taichung',
        location: {
          lat: 24.2204731,
          lng: 120.6756768
        }
      },
      { 
        name: '彰化縣',
        icon: 'Changhua',
        location: {
          lat: 23.992187,
          lng: 120.3230657
        }
      },
      { 
        name: '南投縣',
        icon: 'Nantou',
        location: {
          lat: 23.8412218,
          lng: 120.7023206
        }
      },
      { 
        name: '雲林縣',
        icon: 'Yunlin',
        location: {
          lat: 23.6747002,
          lng: 120.1543941
        }
      },
      { 
        name: '嘉義市',
        icon: 'ChiayiCity',
        location: {
          lat: 23.4790323,
          lng: 120.4142768
        }
      },
      { 
        name: '台南市',
        icon: 'Tainan',
        location: {
          lat: 23.1510076,
          lng: 120.0618201
        }
      },
      { 
        name: '高雄市',
        icon: 'Kaohsiung',
        location: {
          lat: 22.8724273,
          lng: 120.1921921
        }
      },
      { 
        name: '屏東縣',
        icon: 'Pingtung',
        location: {
          lat: 22.3912447,
          lng: 120.067928
        }
      },
      { 
        name: '宜蘭縣',
        icon: 'Yilan',
        location: {
          lat: 25.0374821,
          lng: 121.848923
        }
      },
      { 
        name: '花蓮縣',
        icon: 'Hualien',
        location: {
          lat: 23.7344266,
          lng: 120.8196233
        }
      },
      { 
        name: '台東縣',
        icon: 'Taitung',
        location: {
          lat: 22.7221327,
          lng: 120.6096544
        }
      },
      { 
        name: '澎湖縣',
        icon: 'Penghu',
        location: {
          lat: 23.4815522,
          lng: 119.2404868
        }
      },
      { 
        name: '金門縣',
        icon: 'Kinmen',
        location: {
          lat: 24.3490276,
          lng: 118.1884772
        }
      },
      { 
        name: '連江縣',
        icon: 'Mazu',
        location: {
          lat: 26.1331784,
          lng: 119.9466092
        }
      }
    ]
    let locationBtnMessage = []
    let locationBtnBox = []
    locationArr.forEach((el, index) => {
      locationBtnMessage.push({
        "type": "image",
        "url": `https://mt-weather.herokuapp.com/static/location-icon/${el.icon}.png`,
        "size": "xxl",
        "flex": 1,
        "gravity": "center",
        "offsetStart": "20px"
      },
      {
        "type": "button",
        "action": {
          "type": "postback",
          "label": `${el.name}`,
          "data": `${el.location}`,
          "displayText": `${el.name}`
        },
        "flex": 5
      })
      if ((index + 1) % 2 === 0) {
        locationBtnBox.push({
          "type": "box",
          "layout": "horizontal",
          "contents": locationBtnMessage
        })
        if (index !== (locationArr - 1)) {
          locationBtnBox.push(
            {
            "type": "separator"}
            )
        }
        locationBtnMessage = []
      } else {
        locationBtnMessage.push(
          {
            "type": "separator"
          }
        )
      }
    })
    const replyMessage = [ 
      {
        "type": "flex",
        "altText": "未來六小時天氣",
        // contents
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": locationBtnBox
          }
        }
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
          "weight": "bold",
          "align": "start"
        },
        {
          "type": "text",
          "text": "溫度",
          "size": "md",
          "weight": "bold",
          "align": "center"
        },
        {
          "type": "text",
          "text": "降雨機率",
          "size": "md",
          "weight": "bold",
          "align": "end"
        }
      ]
    }
    const finallyData = {'hourly': null, 'daily': null}
    Object.keys(finallyData).forEach(keys => {
      console.log(keys)
      const weatherData = [
        weatherTitle
      ]
      weatherResult[keys].data.forEach((el, index) => {
        weatherData.push(
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": `${el.time}`,
                "size": "sm",
                "align": "start"
              },
              {
                "type": "text",
                "text": `${el.temperature} °C`,
                "size": "sm",
                "align": "center"
              },
              {
                "type": "text",
                "text": `${Math.round(el.precipProbability * 100)} %`,
                "align": "end"
              }
            ]
          }
        )
        if (index < weatherResult[keys].data.length - 1) {
          weatherData.push({
            "type": "separator"
          })
        }
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