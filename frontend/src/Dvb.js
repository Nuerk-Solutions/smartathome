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
    const [seconds, setSeconds] = useState(-1);

    useEffect(() => {
        const timer = seconds >= 0 && setInterval(() => setSeconds(seconds - 1), 1000);
        if (seconds < 0) {
            setSeconds(5);
            dvb.monitor(stopID, timeOffset, numResults)
                .then(result => {
                        setIsLoaded(true);
                        setJson(result);
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
        return () => clearInterval(timer);
    }, [seconds]);

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <h1>{props.name}</h1>
                <p>Seconds to next reload: {seconds}</p>
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
                        <tr key={linie.id + linie.scheduledTime.getTime()} id={linie.id + linie.scheduledTime.getTime()}>
                            <td>{linie.line}</td>
                            <td>{linie.direction}</td>
                            <td>{linie.arrivalTimeRelative} min (+{linie.delayTime})</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
