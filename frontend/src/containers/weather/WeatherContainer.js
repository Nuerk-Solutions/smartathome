import React, {Fragment, useContext, useEffect, useState} from 'react'
import {AddressContext} from '../../context/AddressContext'
import FetchWeatherData from '../../utils/FetchWeatherData'
import WeatherForecastContainer from '../weather-forecast/WeatherForecastContainer'
import LoaderComponent from '../../components/weather/loader/LoaderComponent'
import ErrorComponent from '../../components/weather/error/ErrorComponent'
import * as Sentry from '@sentry/browser'
import isValid from '../../utils/ValidityChecker'
import {isNil} from 'lodash-es'
import ErrorBoundaryContainer from "../error-boundary/ErrorBoundaryContainer";

export default () => {
    const addressContext = useContext(AddressContext)
    const [weatherForecast, setWeatherForecast] = useState({})
    const [weatherCurrent, setWeatherCurrent] = useState({})
    const [alerts, setAlerts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    // check whether to show/hide weatherForecastContainer based on weatherCurrent
    const showWeatherForecast = () => {
        return isValid(weatherCurrent)
    }

    // check whether the cityName is valid
    const validCityName = () => {
        if (isValid(addressContext.address)) {
            const cityName = addressContext.address.cityName
            return (
                isValid(cityName) &&
                !cityName.includes('undefined') &&
                !cityName.includes('null')
            )
        }
        return false
    }

    const setWeatherData = (current, forecast, alerts) => {
        if (isValid(current) && isValid(forecast)) {
            setWeatherCurrent(current)
            setWeatherForecast(forecast)
            setAlerts(alerts)
        }
    }

    const fetchWeatherData = async () => {
        try {
            setIsLoading(true)
            const {
                weatherCurrent,
                weatherForecast,
                alerts,
                error,
            } = await FetchWeatherData(addressContext)
            // set the weatherCurrent and weatherForecast only when the data is non-empty
            // this way, the old fetched data can be preserved when api call fail or limit exceed
            if (isNil(error)) {
                setWeatherData(weatherCurrent, weatherForecast, alerts)
                // set the error to false state with the above successful weather data fetch
                setIsError(false)
            } else {
                setIsError(true)
            }
        } catch (err) {
            setIsError(true)
            Sentry.captureException(err)
        } finally {
            setIsLoading(false)
        }
    }

    // show the loading state when fetching address information using lat & long from addressContext
    useEffect(() => {
        setIsLoading(addressContext.showLoader)
    }, [addressContext.showLoader])

    useEffect(() => {
        if (isValid(addressContext.latlong)) {
            fetchWeatherData()
        } else {
            setIsError(true)
        }
        // fetch weather data every 60 minutes
        const timer = setInterval(() => {
            fetchWeatherData()
        }, 3600000)

        return () => {
            clearInterval(timer)
        }
        // eslint-disable-next-line
    }, [addressContext.latlong])

    return (
        <Fragment>
            {isLoading ? (
                <LoaderComponent
                    loaderText={
                        validCityName()
                            ? `Wettervorhersage abrufen für ${addressContext.address.cityName} 😎`
                            : 'Abrufen der Daten mithilfe des Standortes'
                    }
                />
            ) : (
                <Fragment>
                    {isError ? (
                        <div className='flex justify-center'>
                            <div className='sm:w-full lg:w-2/3 xl:w-1/2'>
                                <ErrorComponent
                                    errorMessage={
                                        validCityName()
                                            ? `Etwas ist schief gelaufen. Fehler beim Abrufen der Wettervorhersage für ${addressContext.address.cityName}! 😢`
                                            : 'Fehler beim Abrufen der Adressinformationen für Ihren Standort. Bitte suche nach einer beliebigen Stadt, um die Wettervorhersage zu erhalten!!'
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <ErrorBoundaryContainer>
                            <div>
                                {showWeatherForecast() ? (
                                    <WeatherForecastContainer
                                        weatherCurrent={weatherCurrent}
                                        weatherForecast={weatherForecast}
                                        alerts={alerts}
                                        address={addressContext.address}
                                        latlong={addressContext.latlong}
                                    />
                                ) : null}
                             </div>
                         </ErrorBoundaryContainer>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}
