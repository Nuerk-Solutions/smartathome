import React, {useEffect, useState} from 'react';
import * as dvb from "dvbjs";

//HBF: 33000028
//Malterstraße: 33000146

const stopID = "33000146"; // Malterstraße
const timeOffset = 0;
const numResults = 10;

export function DvbWidget(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);

    useEffect(() => {
        dvb.monitor(stopID, timeOffset, numResults)
            .then(result => {
                    console.dir(result);
                    setIsLoaded(true);
                    setJson(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <h1>{props.name}</h1>
                <table className="table-dvb">
                    <thead>
                        <tr>
                            <th>Linie</th>
                            <th>Richtung</th>
                            <th>Ankunft</th>
                        </tr>
                    </thead>
                    <tbody>
                        {json.map(linie => (
                            <tr key={linie.index} id={linie.index}>
                                <td>{linie.line}</td>
                                <td>{linie.direction}</td>
                                <td>{getMinutesBetweenDates(new Date(), linie.scheduledTime)} min</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

function getMinutesBetweenDates(startDate, endDate) {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.round(diff / 60000);
}
