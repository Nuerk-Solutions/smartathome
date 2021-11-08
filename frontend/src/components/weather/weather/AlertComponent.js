import React, {useContext} from 'react'
import {FaExclamationTriangle} from 'react-icons/fa'
import {ThemeContext} from '../../../context/ThemeContext'
import {FormatTime} from '../../../utils/TimeUtils'

export default ({alert}) => {
    const {timezone, event, start, end, description, sender_name} = alert
    const {theme, colorTheme} = useContext(ThemeContext)
    const startTime = FormatTime(start, timezone, 'dddd h:mm A')
    const endTime = FormatTime(end, timezone, 'dddd h:mm A')

    return (
        <div className={'flex flex-col justify-center items-center'}>
            <div className={`w-11/12 lg:w-3/4 xl:max-w-5xl`}>
                <div
                    className={`bg-${theme} border-t-4 border border-red-700 rounded-lg text-${colorTheme} px-3 py-3 shadow-xl`}
                    role='alert'>
                    <div className='flex'>
                        <div className='pt-1 px-2'>
                                <FaExclamationTriangle
                                    className={`text-red-700 text-lg`}
                                    title="Warnung"
                                />
                        </div>
                        <div className='w-full'>
                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
                                <p className='sm:w-1/2 font-bold capitalize'>
                                    {event}
                                </p>
                                <p className='sm:w-1/2 sm:text-right font-semibold text-xs'>
                                    <span>{startTime}</span>
                                    &nbsp;<span>-</span>&nbsp;
                                    <span>{endTime}</span>
                                </p>
                            </div>
                                <p className='text-sm font-medium py-8'>
                                    <b>Description:&nbsp;</b>
                                    {description}
                                </p>
                            <b>Sender: {sender_name}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
