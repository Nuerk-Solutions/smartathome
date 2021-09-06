import React, {useContext} from 'react'
import {WeatherUnitContext} from '../../../context/WeatherUnitContext'
import {cToF, fToC} from '../../../utils/TemperatureConvert'
import getWeatherIcon from '../../../utils/WeatherIcon'
import FormatTime from '.././../../utils/FormatTime'
import WeatherIconComponent from './WeatherIconComponent'
import {ThemeContext} from '../../../context/ThemeContext'


export default ({Timeframe}) => {
    const {weatherUnit} = useContext(WeatherUnitContext)
    const {theme, colorTheme} = useContext(ThemeContext)

    /**
     * type can be `temp` or `feels_like`
     * @param {String} type
     */
    const computedTempValue = (type) => {
        return weatherUnit === 'C'
            ? Math.round(Timeframe[`${type}`])
            : cToF(Timeframe[`${type}`])
    }

    return (
        <div
            className={`border-none flex flex-col justify-start items-center mx-3 mb-3 w-full font-light text-${colorTheme} md:text-light`}>
            <div>
                {getWeatherIcon(Timeframe).startsWith('wi') ? (
                    <p className='text-5xl mt-4' title={Timeframe.description}>
                        <WeatherIconComponent type={getWeatherIcon(Timeframe)}/>
                    </p>
                ) : (
                    <object
                        data={`/weather/${getWeatherIcon(Timeframe)}.svg`}
                        // alt='icon'
                        title={Timeframe.description}
                        className='w-16 h-16 object-contain'
                    />
                )}
            </div>
            <p className='text-base pb-1'>
                {computedTempValue('temp')}
                <sup>o</sup>
            </p>
            <p className='text-xs pb-1'>
                {computedTempValue('feels_like')}
                <sup>o</sup>
            </p>
            <p className='text-sm font-medium'>
                {FormatTime(Timeframe.dt, Timeframe.timezone, 'HH:mm')}
            </p>
        </div>
    )
}
