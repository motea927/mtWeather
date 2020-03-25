const axios = require('axios')
let key = process.env.WEATHER_KEY
if (!key) key = require('../weather-key')
const getWeather = (lat, lng) => {
  axios.get(`https://api.darksky.net/forecast/${key}/${lat},${lng}`)
  .then(function (response) {
    // handle success
    console.log(response)
    return response
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

module.exports.getWeather = getWeather;