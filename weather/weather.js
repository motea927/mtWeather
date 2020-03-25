const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}?exclude=daily&lang=zh-tw&units=si`)
    const time = [response.data.hourly.data[0].time, response.data.hourly.data[1].time]
    time.forEach((UNIX_Timestamp) => {
      const date = new Date((UNIX_Timestamp + 28800)* 1000)
      console.log(date)
    })
    console.log(response.data.hourly.data[0])
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;