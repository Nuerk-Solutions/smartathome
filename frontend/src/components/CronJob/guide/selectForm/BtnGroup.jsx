import React from 'react'

const BtnGroup = ({ isDateSelected, handleClear, fieldName }) => {
  return (
    <div className='btn-group'>
      <button
        onClick={() => handleClear({ fieldName })}
        className={
          isDateSelected
            ? 'btn-group__clear--active'
            : 'btn-group__clear'
        }
        type='button'
        aria-label='Clear'
        title='Löschen'
      >
        <span className='dropdown__icon-btn__label'>
          <svg
            className='MuiSvgIcon-fontSizeSmall'
            viewBox='0 0 24 24'
            aria-hidden
          >
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
          </svg>
        </span>
        <span className='btn-group__btn-foot' />
      </button>
      <button
        className='dropdown__arrow-icon'
        type='button'
        aria-label='Open'
        title='Open'
      >
        <span className='dropdown__icon-btn__label'>
          <svg
            className='MuiSvgIcon-root'
            viewBox='0 0 24 24'
            aria-hidden
          >
            <path d='M7 10l5 5 5-5z' />
          </svg>
        </span>
        <span className='btn-group__btn-foot' />
      </button>
    </div>
  )
}

export default BtnGroup
