const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}`).data
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}

module.exports.getWeather = getWeather;