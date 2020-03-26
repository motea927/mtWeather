const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')

function addZeroString (num) {
  if (num >= 10) return num
  return `0${num}`
}
const weekDay = ['日', '一', '二', '三', '四', '五', '六']
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}?exclude=minutely,flags&lang=zh-tw&units=si`)
    const currently = response.data.currently
    const hourly = response.data.hourly
    const daily = response.data.daily
    hourly.data = hourly.data.slice(0, 6)
    hourly.data.forEach( hourlyData => {
      const date = new Date((hourlyData.time + 28800) * 1000)
      hourlyData.time = `${date.getHours()}:${addZeroString(date.getMinutes())}`
    })
    daily.data.forEach(dailyData => {
      const date = new Date((dailyData.time + 28800) * 1000)
      dailyData.time = `${addZeroString(date.getMonth() + 1)}/${addZeroString(date.getDate())} (${weekDay[date.getDay()]})`
      dailyData.temperature = `${Math.round(dailyData.temperatureMin)}~${Math.round(dailyData.temperatureMax)}`
    })
    return {
      currently,
      hourly,
      daily
    }
    // console.log(daily.data)
    // console.log(hourlyDataArr)
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;