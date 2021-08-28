import React from 'react'
import PropTypes from 'prop-types'
import MinDropdown from './MinDropdown'
import MonDropdown from './MonDropdown'
import DOMDropdown from './DOMDropdown'
import DOWDropdown from './DOWDropdown'
import HourDropdown from './HourDropdown'
import { convertToCronSyntax } from '../utils/helper'

const DropdownForm = ({
  handleClear,
  handleClickClose,
  handleChange,
  select
}) => {
  const handleAllClear = () => {
    const fieldName = ['mon', 'dow', 'dom', 'hour', 'min']
    handleClear({ fieldName })
  }

  const res = convertToCronSyntax(select)
  const splitted = res.split(' ')
  const min = splitted[0] !== '*'
  const hour = splitted[1] !== '*'
  const dom = splitted[2] !== '*'
  const mon = splitted[3] !== '*'
  const dow = splitted[4] !== '*'

  return (
    <form>
      <div className="dropdowns__wrapper">
        <div className="dropdown__container">
          <div className='guide__helper-text-box'>
            <span
              className={
                mon
                  ?'guide__helper-text--selected'
                  :'guide__helper-text'
              }
            >
              IM
            </span>
          </div>
          <MonDropdown
            handleClear={handleClear}
            select={select}
            handleChange={handleChange}
            handleClickClose={handleClickClose}
          />
        </div>
        <div className="dropdown__container">
          <div className='guide__helper-text-box'>
            <span
              className={
                dom
                  ?'guide__helper-text--selected'
                  :'guide__helper-text'
              }
            >
              AM
            </span>
          </div>

          <DOMDropdown
            handleClear={handleClear}
            handleClickClose={handleClickClose}
            select={select}
            handleChange={handleChange}
          />
        </div>

        <div className="dropdown__container">
          <div className='guide__helper-text-box'>
            <span
              className={
                dow
                  ?'guide__helper-text--selected'
                  :'guide__helper-text'
              }
            >
              AM
            </span>
          </div>

          <DOWDropdown
            handleClear={handleClear}
            handleClickClose={handleClickClose}
            select={select}
            handleChange={handleChange}
          />
        </div>
        <div className="dropdown__container">
          <div className='guide__helper-text-box'>
            <span
              className={
                hour
                  ?'guide__helper-text--selected'
                  :'guide__helper-text'
              }
            >
              UM
            </span>
          </div>

          <HourDropdown
            handleClear={handleClear}
            handleClickClose={handleClickClose}
            select={select}
            handleChange={handleChange}
          />
        </div>
        <div className="dropdown__container">
          <div className='guide__helper-text-box'>
            <span
              className={
                min
                  ?'guide__helper-text--selected'
                  :'guide__helper-text'
              }
            >
              :
            </span>
          </div>

          <MinDropdown
            handleClear={handleClear}
            handleClickClose={handleClickClose}
            select={select}
            handleChange={handleChange}
          />
        </div>
      </div>
      <div className='guide__clear-button__wrapper'>
        <button
          className='guide__btn--clear'
          title='Clear'
          type='button'
          onClick={handleAllClear}
        >
          <span>Clear</span>
        </button>
      </div>
    </form>
  )
}

DropdownForm.propTypes = {
  handleClear: PropTypes.func.isRequired
}

export default DropdownForm
