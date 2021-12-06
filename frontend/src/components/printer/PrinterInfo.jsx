import React, {Fragment, Suspense, useEffect, useState} from "react"
import axios from "axios";
import ErrorComponent from "../weather/error/ErrorComponent";
import LoaderComponent from "../weather/loader/LoaderComponent";

export default function PrinterInfo() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:2000/printer')
            .then(res => {
                setJson(res.data);
                setIsLoaded(true);
            })
            .catch(error => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

    if (error) {
        return (
            <div className='flex justify-center'>
                <div className='w-5/6'>
                    <ErrorComponent
                        errorMessage={error.message}
                        showCloseBtn={true}
                        closeError={() => {
                            setError(null);
                        }}
                    />
                </div>
            </div>
        );
    } else if (!isLoaded) {
        return (
            <LoaderComponent loaderText={`Abrufen der neusten Daten 😎`}/>
        );
    } else {
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                    }>
                    <div>
                        {
                            json
                        }
                    </div>
                </Suspense>
            </Fragment>
        );
    }
}
