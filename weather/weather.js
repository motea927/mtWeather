const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}?exclude=daily&lang=zh-tw&units=si`)
    console.log(response.data.hourly)
    const summary = response.data.hourly.summary
    const hourlyDataArr = response.data.hourly.data.slice(0, 5)
    hourlyDataArr.forEach((hourlyData) => {
      const date = new Date((hourlyData.time + 28800)* 1000)
      hourlyData.time = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
    })
    return {
      summary,
      hourlyDataArr
    }
    console.log(response.data)
    console.log(hourlyDataArr)
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;