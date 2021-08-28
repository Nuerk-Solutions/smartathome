import React from 'react'
import PropTypes from 'prop-types'
import { isShouldBeOn } from '../utils/helper'
import BtnGroup from './BtnGroup'

const SelectedDates = ({ dom, handleClickClose }) => {
  const msg = 'Jeden Tag im Monat'

  if (dom === '*') {
    return (
      <div className='dropdown__selected-date'>
        <span className='dropdown__selected-date__placeholder'>
          {msg}
        </span>
      </div>
    )
  }
  const splitted = dom.split(',')

  const res = splitted.map((item, index) => {
    return (
      <div
        role='button'
        key={index}
        className='dropdown__input-wrapper'
      >
        <span className='dropdown__selected-date__text'>{item}</span>
        <svg
          onClick={() =>
            handleClickClose({ item: { value: item }, fieldName: 'dom' })
          }
          className='dropdown__close-icon'
          focusable={false}
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z' />
        </svg>
      </div>
    )
  })
  return <div className='dropdown__selected-date'>{res}</div>
}

const createArrWithNum = (num) => {
  const arr = []
  for (let i = 0; i < num; i++) {
    const iPlusOne = i + 1
    arr.push(iPlusOne.toString())
  }
  const res = arr.map((item, index) => {
    const iPlusOne = index + 1
    return {
      id: iPlusOne.toString(),
      value: iPlusOne.toString(),
      label: item
    }
  })
  return res
}

const DOWDropdown = ({
  handleClear,
  select,
  handleChange,
  handleClickClose
}) => {
  const { dom } = select
  const res = createArrWithNum(31)
  const isDateSelected = dom !== '*'

  return (
    <React.Fragment>
      <div className="dropdown__wrapper">
        <div className="dropdown">
          <div className="dropdown__current" tabIndex='1'>
            <input
              type='text'
              value=''
              readOnly
              name='Ben'
              className="dropdown__input"
            />

            <SelectedDates handleClickClose={handleClickClose} dom={dom} />
            <BtnGroup
              fieldName={['dom']}
              handleClear={handleClear}
              isDateSelected={isDateSelected}
            />
          </div>
          <div className='dom-picker__wrapper'>
            <ul className='dom-picker'>
              {res.map((item) => {
                const isOn = isShouldBeOn(item.value, dom)

                return (
                  <li
                    onClick={() => handleChange({ fieldName: 'dom', item })}
                    key={item.id}
                    className='dom-picker__item'
                  >
                    <label
                      className={
                        isOn
                          ? 'dom-picker__item-label--selected'
                          : `dom-picker__item-label`
                      }
                      htmlFor={item.id}
                      aria-hidden={true}
                    >
                      {item.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

DOWDropdown.propTypes = {}

export default DOWDropdown
