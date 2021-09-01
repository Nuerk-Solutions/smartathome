import React, {useContext} from 'react'
import {ThemeContext} from '../../../context/ThemeContext'

export default ({favorite, favoriteSelected, index, selectedIndex}) => {
    const {theme, colorTheme} = useContext(ThemeContext)
    return (
        <div
            className={`h-16 text-${colorTheme} bg-${theme} hover:bg-${colorTheme} hover:text-${theme} border ${
                index === selectedIndex
                    ? 'sm:border-teal-600'
                    : `sm:border-${colorTheme}`
            }
        } pt-5 lg:pt-1/2 font-semibold rounded-2xl cursor-pointer text-center justify-center`}
            onClick={favoriteSelected}>
            {favorite.address.cityName.split(', ')[0]}
        </div>
    )
}

