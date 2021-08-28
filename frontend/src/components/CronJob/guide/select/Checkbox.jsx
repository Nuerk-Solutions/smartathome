import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ isOn }) => {
  return (
    <span className="checkbox__wrapper" aria-disabled='false'>
      <span
        className={`${
          isOn
            ? 'tz-sub-select__checkbox--checked'
            : 'tz-sub-select__checkbox'
        }`}
      >
        <input
          className="checkbox__input"
          type='checkbox'
          value=''
          readOnly
        />
        <svg
          className={`${
            isOn ? 'tz-sub-select--checkbox' : 'tz-sub-select'
          }`}
          viewBox='0 0 24 24'
          aria-hidden
        >
          <path d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
        </svg>
      </span>
      <span
        className={`${
          isOn ? "checkbox__animator__checked" : "checkbox__animator"
        }`}
      />
    </span>
  )
}

Checkbox.propTypes = {}

export default Checkbox
