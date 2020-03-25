const express = require('express');
const line = require('@line/bot-sdk');
const config = require('./line-key-config.js');


const app = express();
app.post('/', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(process.env.PORT || 8080, function() {
  console.log(`App now running on port ${process.env.PORT || 8080}`);
});