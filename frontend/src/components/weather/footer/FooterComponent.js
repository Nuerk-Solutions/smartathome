import React, {useContext} from 'react'
import {ThemeContext} from '../../../context/ThemeContext'

export default () => {
  const {theme, colorTheme} = useContext(ThemeContext)

  return (
    <div
      className={`text-${colorTheme} pb-3`}
      style={{
        backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
      }}>
      <div
        className={`flex flex-col text-center sm:flex sm:flex-row justify-around pt-5 text-${colorTheme} text-sm`}>
        <p className='flex flex-no-wrap justify-center items-center my-2 sm:my-0 w-full sm:w-1/2'>
          {new Date().toLocaleTimeString()}
        </p>
      </div>
      <p className='mx-auto text-center text-sm'>
        {new Date().toLocaleDateString()}
      </p>
    </div>
  )
}
