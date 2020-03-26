const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}?exclude=daily&lang=zh-tw&units=si`)
    const hourlyDataArr = response.data.hourly.slice(0, 5)
    hourlyDataArr.forEach((hourlyData) => {
      hourlyData.time = new Date((hourlyData.time + 28800)* 1000)
    })
    console.log(response.data)
    console.log(hourlyDataArr)
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;