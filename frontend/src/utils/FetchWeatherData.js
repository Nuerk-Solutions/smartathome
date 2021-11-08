import axios from 'axios'
import axiosRetry from 'axios-retry'
import FormatTime from './TimeUtils'
import isValid from './ValidityChecker'

// Exponential back-off retry delay between requests
axiosRetry(axios, {retryDelay: axiosRetry.exponentialDelay})

const getURL = (latlong) => {
  const args = latlong.split(",");
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${args[1]}&lon=${args[0]}&exclude=minutely,flags&lang=de&units=metric&cnt=7&appid=992c820be22089cd7521bb068ba020c2`
  // return `${API_URL}/forecast/coords/${latlong}?extend=hourly&exclude=minutely,flags`
}

/**
 * @param {String} latlong (-43.53333,172.63333)
 */
const FetchWeatherData = async ({latlong}) => {
  let weatherCurrent = {}
  let weatherForecast = {}
  let alerts = []
  let error = null

  // fetch weather data only when latlong is valid to avoid uneccessary API calls
  if (isValid(latlong)) {
    try {
      const weatherData = (await axios.get(getURL(latlong))).data
      if (isValid(weatherData)) {
        // NOTE: add timezone property to current, days, and timeFrame data to use it later for
        // displaying weatherIcon with day or night variants specific to location timezone
        // parsing sunriseTime & sunsetTime according to the timezone
        const timezone = weatherData.timezone

        weatherCurrent = {
          timezone,
          ...weatherData.current,
          sunrise: weatherData.daily[0].sunrise,
          sunset: weatherData.daily[0].sunset,
        }

        // group 168 hours into days as keys in timeFrames
        // group days and timeFrames into weatherForecast
        const timeFrames = {}
        // create date as the keys for timeFrame in timeFrames
        // i.e timeFrames: {'02/28/2020': [{...timeFrame},...], ...}
        weatherData.hourly.forEach((hour) => {
          const date = FormatTime(hour.dt, timezone, 'MM/DD/YYYY')
          if (Object.keys(timeFrames).includes(date)) {
            timeFrames[date].push({timezone, ...hour})
          } else {
            timeFrames[date] = [{timezone, ...hour}]
          }
        })
        const days = {}
        // create date as the keys for the day in days
        // i.e days: {'02/28/2020': {...day}, ...}
        weatherData.daily.forEach((day) => {
          const date = FormatTime(day.dt, timezone, 'MM/DD/YYYY')
          // since there will be unique day objects in days
          // just create a 'date' key with day object as value for as many days
          days[date] = {timezone, ...day}
        })

        weatherForecast = {timeFrames, days}

        if (isValid(weatherData.alerts)) {
          weatherData.alerts.forEach((alert) => {
            alerts.push({
              timezone,
              ...alert,
            })
          })
        }
      }
    } catch (err) {
      error = err
      console.err(err);
    }
  }

  return {
    weatherCurrent,
    weatherForecast,
    alerts,
    error,
  }
}

export default FetchWeatherData
