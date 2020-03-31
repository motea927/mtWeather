const express = require('express')
const line = require('@line/bot-sdk')
const middleware = line.middleware
const config =  require('./config/config')
const lineClient = require('./lineClient/lineClient')
const app = express()

app.post('/webhook', middleware(config), (req, res) => {
  const userMessage = req.body.events[0]
  console.log(req.body.events[0])
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
    console.log(userMessage.postback.data[0])
    console.log(userMessage.postback.data[1])
    console.log(JSON.parse(userMessage.postback.data))
  }
})
app.use('/static', express.static('img'))
app.listen(process.env.PORT || 8080)