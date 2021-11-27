import moment from 'moment-timezone'

/**
 * @param {Number} timestamp
 * @param {String} timezone
 * @param {String} formatType (moment format types)
 */
export const FormatTime = (timestamp, timezone, formatType) => {
    return moment.tz(timestamp * 1000, timezone).format(formatType)
}

export const convertMillisecondsToReadableFormat = duration => {
    let seconds = Math.floor(duration / 1000000) % 60;
    let minutes = Math.floor(duration / (1000000 * 60)) % 60;
    let hours = Math.floor(duration / (1000000 * 60 * 60)) % 24;
    return `${hours && hours + 'h' || ''} ${minutes && minutes + 'm' || ''} ${seconds && seconds + 's' || ''}`;
}
