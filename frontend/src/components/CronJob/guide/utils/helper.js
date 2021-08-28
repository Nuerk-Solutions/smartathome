import { ASTERISK, ONE_NUMBER, SEVERAL_NUMBERS } from './types';
export const getIsOn = (tzValue, itemValue, openOtherTzList) => {
  if (openOtherTzList && itemValue === 'other') {
    return true
  } else if (openOtherTzList) {
    return false
  } else if (tzValue === itemValue) {
    return true
  }
}

export const getDefaultFnsWithSavedSelects = (savedSelects) => {
  let output = ''
  for (let i = 0; i < savedSelects.length; i++) {
    output += `const function_${i + 1} = () => {};
  
`
  }

  return output
}

const getTaskObj = (select, index) => `
      {
        fn: function_${index + 1},
        id: '${index + 1}',
        config: '${select}',
        name: '',
        description: ''
      }
    `

export const convertSavedSelectsToProps = (savedSelects) => {
  if (savedSelects.length < 1) {
    let output = ''
    output = 'const tasks = ['
    output += ']'
    return output
  }

  const res = savedSelects.map((select, index) => {
    const obj = getTaskObj(select, index)
    let output = ''
    if (index === 0) {
      output = 'const tasks = ['
    }
    output += obj
    if (index === savedSelects.length - 1) {
      output += ']'
    }
    return output
  })
  return res
}

export const getTzVariableText = (value) => {
  let val
  switch (value) {
    case 'default':
      val = `'UTC'`
      break
    default:
      val = `'${value}'`
      break
  }
  return val
}

export const convertToCronSyntax = (select) => {
  let res = `* * * * *`
  const splitted = res.split(' ')
  const { min, hour, dow, dom, mon } = select
  if (min !== '*') {
    splitted[0] = min
  }
  if (hour !== '*') {
    splitted[1] = hour
  }
  if (dom !== '*') {
    splitted[2] = dom
  }
  if (mon !== '*') {
    splitted[3] = mon
  }
  if (dow !== '*') {
    splitted[4] = dow
  }

  res = splitted.join(' ')

  return res
}


export const isShouldBeOn = (value, fieldValue) => {
  const splitted = fieldValue.split(',')

  if (fieldValue === '*') {
    return false
  } else if (splitted.length === 1) {
    if (fieldValue === value) {
      return true
    } else {
      return false
    }
  } else if (splitted.length > 1) {
    const found = splitted.find((val) => val === value)

    if (found) {
      return true
    } else {
      return false
    }
  }
}



export const formatDOWGudie = (dows) => {
  const msg = `Bad config, month is required to be less than 13`
  const formatted = dows.map((value) => {
    switch (value) {
      case '1':
        return { hrText: 'Monday', value }
      case '2':
        return { hrText: 'Tuesday', value }
      case '3':
        return { hrText: 'Wednesday', value }
      case '4':
        return { hrText: 'Thirsday', value }
      case '5':
        return { hrText: 'Friday', value }
      case '6':
        return { hrText: 'Saturday', value }
      case '7':
        return { hrText: 'Sunday', value }
      default:
        throw Error(msg)
    }
  })
  return formatted
}

export const formatDOW = (dow) => {
  if (typeof dow !== typeof {}) throw Error('Bad args')
  const msg = 'Bad config, dow is required to be less than 8'
  const { value } = dow
  const formatted = value.map((val) => {
    switch (val) {
      case '*':
        return '*'
      case '1':
        return 'Monday'
      case '2':
        return 'Tuesday'
      case '3':
        return 'Wednesday'
      case '4':
        return 'Thirsday'
      case '5':
        return 'Friday'
      case '6':
        return 'Saturday'
      case '7':
        return 'Sunday'
      default:
        throw Error(msg)
    }
  })
  const result = { ...dow, value: formatted }
  return result
}



export const formatMonth = (mon) => {
  if (typeof mon !== typeof {}) throw Error('Bad argument')
  const { value } = mon

  const msg = `Bad config, month is required to be less than 13`
  const formatted = value.map((val) => {
    switch (val) {
      case '*':
        return '*'
      case '1':
        return 'January'
      case '2':
        return 'Faburary'
      case '3':
        return 'March'
      case '4':
        return 'April'
      case '5':
        return 'May'
      case '6':
        return 'June'
      case '7':
        return 'July'
      case '8':
        return 'Augest'
      case '9':
        return 'September'
      case '10':
        return 'October'
      case '11':
        return 'November'
      case '12':
        return 'December'
      default:
        throw Error(msg)
    }
  })
  const result = { ...mon, value: formatted }
  return result
}

export const formatMonthInGudie = (mons) => {
  const msg = `Bad config, month is required to be less than 13`
  const formatted = mons.map((value) => {
    switch (value) {
      case '1':
        return { hrText: 'January', value }
      case '2':
        return { hrText: 'Faburary', value }
      case '3':
        return { hrText: 'March', value }
      case '4':
        return { hrText: 'April', value }
      case '5':
        return { hrText: 'May', value }
      case '6':
        return { hrText: 'June', value }
      case '7':
        return { hrText: 'July', value }
      case '8':
        return { hrText: 'Augest', value }
      case '9':
        return { hrText: 'September', value }
      case '10':
        return { hrText: 'October', value }
      case '11':
        return { hrText: 'November', value }
      case '12':
        return { hrText: 'December', value }
      default:
        throw Error(msg)
    }
  })
  return formatted
}



export const converConfigValuesToObject = (str) => {
  const arr = str.split(',')
  if (arr[0] === '*') {
    return {
      type: ASTERISK,
      length: arr.length,
      value: arr
    }
  }
  if (isNaN(arr[0])) {
    // means this value is timezone
    return {
      type: ASTERISK,
      length: arr.length,
      value: arr
    }
  }
  if (arr.length === 1) {
    const value = arr.map((item) => {
      if (item.length === 2 && item[0] === '0') {
        // means user formatted time differenctly like this 01 , 02
        const newItem = item[1]
        return newItem
      }
      return item
    })
    return {
      type: ONE_NUMBER,
      length: arr.length,
      value
    }
  } else if (arr.length > 1) {
    const value = arr.map((item) => {
      if (item.length === 2 && item[0] === '0') {
        // means user formatted time differenctly like this 01 , 02
        const newItem = item[1]
        return newItem
      }
      return item
    })

    return {
      type: SEVERAL_NUMBERS,
      length: arr.length,
      value
    }
  } else {
    throw Error('Bad Settings')
  }
}


export const formatHour = (hourStr) => {
  if (typeof hourStr !== typeof '') throw Error('Bad arg')

  let hourFormat = ''

  let intHour = Number(hourStr)
  if (intHour > 12) {
    intHour -= 12
    hourFormat = 'PM'
  } else {
    hourFormat = 'AM'
  }

  const res = `${intHour.toString()}${hourFormat}`

  return res
}
