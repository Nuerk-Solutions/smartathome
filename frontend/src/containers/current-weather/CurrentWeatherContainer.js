import React, {Fragment} from 'react'
import InfoComponent from '../../components/weather/weather/InfoComponent'
import InfoDetailComponent from '../../components/weather/weather/InfoDetailComponent'
import LoaderComponent from '../../components/weather/loader/LoaderComponent'
import ErrorBoundaryContainer from '../error-boundary/ErrorBoundaryContainer'

export default ({weatherCurrent, address, latlong}) => {
    return (
        <ErrorBoundaryContainer>
            <Fragment>
                {address && weatherCurrent ? (
                    <div>
                        <InfoComponent
                            address={address}
                            latlong={latlong}
                            weatherCurrent={weatherCurrent}
                        />
                        <InfoDetailComponent weatherCurrent={weatherCurrent}/>
                    </div>
                ) : (
                    <LoaderComponent/>
                )}
            </Fragment>
        </ErrorBoundaryContainer>
    )
}
