const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}?exclude=minutely,flags&lang=zh-tw&units=si`)
    console.log(response.data.hourly)
    const currently = response.data.currently
    const hourly = response.data.hourly
    const daily = response.data.daily
    hourly.data = hourly.data.slice(0, 6)
    hourly.data.forEach( hourlyData => {
      const date = new Date((hourlyData.time + 28800) * 1000)
      hourlyData.time = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
    })
    daily.data.forEach( dailyData => {
      dailyData.time = new Date((dailyData.time + 28800) * 1000).Format('yyyy-MM-dd')
      console.log(dailyData.time)
    })
    return {
      currently,
      hourly,
      daily
    }
    // console.log(response.data)
    // console.log(hourlyDataArr)
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;