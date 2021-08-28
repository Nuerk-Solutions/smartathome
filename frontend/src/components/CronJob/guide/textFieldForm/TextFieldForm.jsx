import React from 'react'
import PropTypes from 'prop-types'
import {
  formatMonth,
  formatDOW,
  converConfigValuesToObject,
  convertToCronSyntax,
  formatHour
} from '../utils/helper'
import { ASTERISK } from '../utils/types'

const getHRtime = (config) => {
  const splittedConfig = config.split(' ')
  const convertedConfig = splittedConfig.map((item) => {
    const obj = converConfigValuesToObject(item)
    return obj
  })
  let hrTime = ''

  // const { hour, hourFormat } = formatHour(convertedConfig[1])
  // const inserted = insertZero(splitted)
  // // console.log('inserted ::', inserted)
  const min = convertedConfig[0]
  const hour = convertedConfig[1]
  const dom = convertedConfig[2]
  const mon = formatMonth(convertedConfig[3])

  const dow = formatDOW(convertedConfig[4])

  if (mon.type === ASTERISK) {
    hrTime += 'Jeden Monat'
  } else {
    const arr = mon.value
    hrTime += `In`
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        hrTime += ` ${arr[i]}`
      } else {
        hrTime += `, ${arr[i]}`
      }
    }
  }

  if (dom.type === ASTERISK) {
    hrTime += ''
  } else {
    const arr = dom.value
    hrTime += ` am`
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        hrTime += ` ${arr[i]}th`
      } else {
        hrTime += `, ${arr[i]}th`
      }
    }
  }

  if (dow.type === ASTERISK) {
    hrTime += ''
  } else {
    const arr = dow.value
    if (dom.type === ASTERISK) {
      hrTime += ` am`
    } else {
      hrTime += ` und`
    }
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        hrTime += ` ${arr[i]}`
      } else {
        hrTime += `, ${arr[i]}`
      }
    }
  }

  if (hour.type === ASTERISK) {
    hrTime += ' jede Stunde'
  } else {
    const arr = hour.value
    hrTime += ` um`
    for (let i = 0; i < arr.length; i++) {
      const res = formatHour(arr[i])
      if (i === 0) {
        hrTime += ` ${res}`
      } else {
        hrTime += `, ${res}`
      }
    }
  }

  if (min.type === ASTERISK) {
    hrTime += ' jede Minute'
  } else {
    const arr = min.value
    if (hour.type !== ASTERISK) {
      hrTime += ` und am`
    } else {
      hrTime += ` am`
    }
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        hrTime += ` ${arr[i]} minute(n)`
      } else {
        hrTime += `, ${arr[i]} minute(n)`
      }
    }
  }

  return { hrTime }
}

const TextFieldForm = ({ select, handleSave, timeZone }) => {
  const value = convertToCronSyntax(select)
  const res = getHRtime(value)
  const isSelected = value !== '* * * * *'

  return (
    <React.Fragment>
      <div className="guide__input__container">
        <p
          className={
            isSelected
              ? 'guide__text-field__label--selected'
              : 'guide__text-field__label'
          }
        >
          Cron Indikator:
        </p>
        <input
          readOnly
          type='text'
          value={value}
          className={
            isSelected ? 'guide__input--selected' : "guide__input"
          }
        />

        <button
          title='Add'
          className='guide__button--store'
          type='button'
          onClick={handleSave}
        >
          SET <i className='right-arrow' />
        </button>
      </div>
      <div className='guide__hr-text__container'>
        <p
          className={
            isSelected
              ? 'guide__hr-text__label--selected'
              : 'guide__hr-text__label'
          }
        >
          Aktuelle Config:
        </p>
        <p
          className={
            isSelected ? 'hr-text--selected' : 'hr-text'
          }
        >
          Wird ausgeführt: {res.hrTime} (
          {timeZone.value === 'default' ? 'UTC' : timeZone.value})
        </p>
      </div>
    </React.Fragment>
  )
}

TextFieldForm.propTypes = {
  select: PropTypes.object.isRequired
}

export default TextFieldForm
