const express = require('express')
const line = require('@line/bot-sdk')
const middleware = line.middleware
const lineClient = require('./lineClient/lineClient')
const app = express()

let config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
if (!config.channelAccessToken) config = require('./api-key/lineApiKey')

app.post('/webhook', middleware(config), (req, res) => {
  const userMessage = req.body.events[0]
  // console.log(req.body.events[0])
  const replyToken = req.body.events[0].replyToken
  if (userMessage.type === 'message') {
    if (userMessage.message.type === 'text') {
      switch (userMessage.message.text) {
        case '我的GPS定位':
          lineClient.sendLocationBtn(replyToken)
          break
        case '自行選取地區':
          // do someing
          lineClient.sendLocationList(replyToken)
          break
        default:
          // lineClient.sendText(replyToken, userMessage.text)
          lineClient.sendText(replyToken, userMessage.message.text)
      }
    } else if (userMessage.message.type === 'location'){
      lineClient.sendWeatherMessage(userMessage.message.latitude, userMessage.message.longitude, replyToken, userMessage.message.address)
    }
    
  }else if (userMessage.type === 'postback') {
    // select some locatioon, userMessage.postback.data = '台北市'
    const data = JSON.parse(userMessage.postback.data)
    lineClient.sendWeatherMessage(data.location.lat, data.location.lng, replyToken, data.name)
    // console.log(data)
  }
})
app.use('/static', express.static('img'))
app.listen(process.env.PORT || 8080)