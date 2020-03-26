const express = require('express')
const line = require('@line/bot-sdk')
const middleware = line.middleware
const config =  require('./config/config')
const lineClient = require('./lineClient/lineClient')
const app = express()

app.post('/webhook', middleware(config), (req, res) => {
  const userMessage = req.body.events[0].message
  console.log(req.body.events[0])
  const replyToken = req.body.events[0].replyToken
  if (userMessage.type === 'text') {
    switch (userMessage.text) {
      case '我的GPS定位':
        lineClient.sendLocationBtn(replyToken)
        break;
      default:
        // lineClient.sendText(replyToken, userMessage.text)
        lineClient.sendText(replyToken, userMessage.text)
    }
  } else if (userMessage.type === 'location') {
    lineClient.sendWeatherMessage(userMessage.latitude, userMessage.longitude, replyToken, userMessage.address)
    // lineClient.sendText(replyToken, userMessage.address)
  }
})
app.use('/static', express.static('img'))
app.listen(process.env.PORT || 8080)