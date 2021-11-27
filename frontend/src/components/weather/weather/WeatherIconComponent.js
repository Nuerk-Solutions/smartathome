import React from 'react'
import {
    WiDayCloudyWindy,
    WiDayFog,
    WiDirectionDown,
    WiDirectionDownLeft,
    WiDirectionDownRight,
    WiDirectionLeft,
    WiDirectionRight,
    WiDirectionUp,
    WiDirectionUpLeft,
    WiDirectionUpRight,
    WiNa,
    WiNightAltCloudyWindy,
    WiNightFog,
    WiSunrise,
    WiSunset,
    WiTornado
} from 'react-icons/wi'

export default ({type}) => {
    const ICON_TYPES = {
        'wi-day-fog': <WiDayFog/>,
        'wi-night-fog': <WiNightFog/>,
        'wi-day-windy': <WiDayCloudyWindy/>,
        'wi-night-windy': <WiNightAltCloudyWindy/>,
        'wi-tornado': <WiTornado/>,
        'wi-na': <WiNa/>,
        up: <WiDirectionUp/>,
        'up-right': <WiDirectionUpRight/>,
        right: <WiDirectionRight/>,
        'down-right': <WiDirectionDownRight/>,
        down: <WiDirectionDown/>,
        'down-left': <WiDirectionDownLeft/>,
        left: <WiDirectionLeft/>,
        'up-left': <WiDirectionUpLeft/>,
        sunrise: <WiSunrise/>,
        sunset: <WiSunset/>
    }

    return ICON_TYPES[type] || <WiNa/>
}
