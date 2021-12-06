import React, {Fragment, Suspense, useEffect, useState} from "react"
import axios from "axios";
import ErrorComponent from "../weather/error/ErrorComponent";
import LoaderComponent from "../weather/loader/LoaderComponent";

export default function PrinterInfo() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(async () => {
        await axios.get('http://localhost:2000/printer')
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
                            Object.keys(json.response.PAGE_PRNINFO[0]).map((key, index) => {
                                return (
                                    json.response.PAGE_PRNINFO[0][key].map((item) => {
                                        const value = item.split(',');
                                        return (
                                            <div key={index}> {convertInkIdToInkName(Number(value[0])) + " - " + value[1] + " - " + value[2]}</div>
                                        );
                                    })
                                );
                            })

                        }
                    </div>
                </Suspense>
            </Fragment>
        );
    }

    // convert InkId (Int) to InkName (String) with 0 = BK, 1 = PGBK, 2 = C, 3 = M, 4 = Y, 5 = GY
    function convertInkIdToInkName(inkId) {
        switch (inkId) {
            case 0:
                return 'BK';
            case 1:
                return 'PGBK';
            case 2:
                return 'C';
            case 3:
                return 'M';
            case 4:
                return 'Y';
            case 5:
                return 'GY';
            default:
                return 'UNKNOWN';
        }
    }


}
