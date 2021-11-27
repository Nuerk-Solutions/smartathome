import {FormatTime} from './TimeUtils'

/**
 * @param {Object} data (weatherCurrent, Timeframe, day)
 */
export default function getWeatherIcon(data) {
    const {dt: time, timezone} = data
    const {icon, id} = data.weather[0];
    const hour = FormatTime(time, timezone, 'H')
    const type = hour >= 6 && hour <= 17 ? 'day' : 'night'
    if (icon) {
        switch (icon) {
            case '01d':
                return 'day'
            case '01n':
                return 'night'
            case '09d':
            case '09n':
            case '10d':
            case '10n':
                return `${type}-rain`
            case '13d':
            case '13n':
                if (id === 611) {
                    return 'sleet';
                }
                return `${type}-snow`
            case '04d':
            case '04n':
                return 'cloudy'
            case '02d':
            case '03d':
                return 'day-cloudy'
            case '02n':
            case '03n':
                return 'night-cloudy'
            case 'hail':
                return 'hail'
            case '11d':
                return 'thunder'
            case '50d':
            case '50n':
                if (id === 781) {
                    return 'wi-tornado'
                }
                return `${type}-cloudy`
            default:
                console.log('Unknown icon', icon)
                return 'wi-na'
        }
    }
    return 'wi-na'
}
