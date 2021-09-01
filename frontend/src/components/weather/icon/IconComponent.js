import React from 'react'
import {FaMoon, FaSun} from 'react-icons/fa'

export default ({iconType}) => {
    return (
        <div>
            {iconType === 'light' ? (
                <p className='text-toggle'>
                    <FaSun/>
                </p>
            ) : (
                <p className='text-toggle'>
                    <FaMoon/>
                </p>
            )}
        </div>
    )
}
