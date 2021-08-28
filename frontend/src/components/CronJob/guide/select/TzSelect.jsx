import React from 'react'
import BtnGroup from './BtnGroup'
import Checkbox from '../selectForm/Checkbox'
import SelectCheckbox from './Checkbox'
import { basicTzList, otherTzList } from '../utils/data'
import { getIsOn } from '../utils/helper'

const TzSelect = ({ timeZone, handleChange, handleReset, openOtherTzList }) => {
  const { value, label } = timeZone
  const isSelected = value !== 'default'

  return (
    <React.Fragment>
      <div className='tz-select__container'>
        <p
          className={
            isSelected
              ? 'tz-select__label--selected'
              : 'tz-select__label'
          }
        >
          Zeit Zone:
        </p>
        <div className="dropdown__wrapper">
          <div className="dropdown">
            <div
              className="dropdown__current"
              style={
                isSelected
                  ? {
                      background: '#efefef'
                    }
                  : {}
              }
              tabIndex='1'
            >
              <input
                type='text'
                value=''
                readOnly
                name='Ben'
                className="dropdown__input"
              />
              <div className='dropdown__selected-date'>
                <p
                  className={
                    isSelected
                      ? 'select__input-text--selected'
                      : 'select__input-text'
                  }
                >
                  {label}
                </p>
              </div>
              <BtnGroup handleReset={handleReset} isSelected={isSelected} />
            </div>
            <ul className='tz-select__list'>
              {basicTzList.map((item) => {
                const isOn = getIsOn(value, item.value, openOtherTzList)

                return (
                  <li
                    onClick={() => handleChange(item)}
                    key={item.id}
                    className='dropdown__list-item'
                  >
                    <div className="dropdown__option">{item.label}</div>
                    <input
                      value={item.label}
                      readOnly
                      className={
                        isOn
                          ? 'dropdown__option__input--selected'
                          : "dropdown__option__input"
                      }
                    />
                    {item.subList ? (
                      <button
                        className={
                          openOtherTzList
                            ? 'tz-select__arrow-btn--open'
                            : 'tz-select__arrow-btn'
                        }
                        type='button'
                        aria-label='Open'
                        title='Öffnen'
                      >
                        <span className='MuiIconButton-label'>
                          <svg
                            className='tz-select__icon-svg'
                            viewBox='0 0 24 24'
                            aria-hidden
                          >
                            <path d='M7 10l5 5 5-5z' />
                          </svg>
                        </span>
                        <span className='btn-group__btn-foot' />
                      </button>
                    ) : (
                      <Checkbox id={item.id} isOn={isOn} />
                    )}
                  </li>
                )
              })}
              {openOtherTzList &&
                otherTzList.map((item) => {
                  const isOtherOn = value === item.value

                  return (
                    <li
                      onClick={() => handleChange(item)}
                      key={item.value}
                      className='dropdown__list-item'
                    >
                      <div className='tz-select__sub-option'>
                        {item.label}
                      </div>
                      <input
                        value={`- ${item.label}`}
                        readOnly
                        className={
                          isOtherOn
                            ? 'tz-select__sub-option__input--selected'
                            : 'tz-select__sub-option__input'
                        }
                      />
                      <SelectCheckbox id={item.id} isOn={isOtherOn} />
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

TzSelect.propTypes = {}

export default TzSelect
