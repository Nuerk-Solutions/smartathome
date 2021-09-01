import React, {Fragment, lazy, Suspense} from 'react'
import AutoCompleteContainer from '../autocomplete/AutoCompleteContainer'
import LoaderComponent from '../../components/weather/loader/LoaderComponent'
import {AddressContextProvider} from '../../context/AddressContext'
import {WeatherUnitContextProvider} from '../../context/WeatherUnitContext'
import ErrorBoundaryContainer from '../error-boundary/ErrorBoundaryContainer'

const WeatherContainer = lazy(() => import('./../weather/WeatherContainer'))
const FavoritesContainer = lazy(() => import('../favorites/FavoritesContainer'))

export default () => {
    return (
        <Fragment>
            <WeatherUnitContextProvider>
                <AddressContextProvider>
                    <AutoCompleteContainer/>
                    <ErrorBoundaryContainer>
                        <Suspense
                            fallback={
                                <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                            }>
                            <WeatherContainer/>
                            <FavoritesContainer/>
                        </Suspense>
                    </ErrorBoundaryContainer>
                </AddressContextProvider>
            </WeatherUnitContextProvider>
        </Fragment>
    )
}
