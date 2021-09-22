import React, {useEffect, useState} from 'react';
import Countdown from "react-countdown";
import axios from "axios";


export default () => {

    const instance = axios.create({
        baseURL: 'https://api.nuerk-solutions.de/api/v1',
        timeout: 1000,
        responseType: 'json',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });

    const [json, setJson] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        // instance.get("/timer")
        //     .then(response => setJson(response.data))
        //     .catch(error => setError(error));

        fetch("https://api.nuerk-solutions.de/api/v1/timer", {mode: "same-origin"})
            .then(response => response.json())
            .then(response => setJson([response]))
            .catch(error => setError(error));

        fetch("https://api.nuerk-solutions.de/api/v1/jobs", {mode: "no-cors"})
            .then(response => response.json())
            .then(response => setJobs([response]))
            .catch(error => setError(error));

        // fetch(`https://panel.nuerk-solutions.de/pump/${pumpState}`)
        //     .then(result => result.json())
        //     .then(result => {
        //             setIsLoaded(true);
        //             console.log(result);
        //         },
        //         (error) => {
        //             setError(error);
        //             console.log(error);
        //             setIsLoaded(true);
        //         });
    }, []);

    return (
        <div>
            <table cellSpacing="10" border={"1px"} className="border-l">
                <tbody>
                {
                    json.map(item => (
                        item.timer.map(value => (
                            <tr key={value.id}>
                                <td>{value.id}</td>
                                <td>{value.name}</td>
                                <td>{value.cron}</td>
                                <td>{value.duration}</td>
                                <td>{value.enabled ? "An" : "Aus"}</td>
                                <td>{value.timestamp}</td>
                            </tr>
                        ))
                    ))
                }
                </tbody>
            </table>
            <table cellSpacing="10" border={"1px"} className="border-l">
                <tbody>
                {
                    jobs.map(item => (
                        item.jobs.map(value => (
                            <tr key={value.id}>
                                <td>{value.id}</td>
                                <td>{value.timerId}</td>
                                <td>{value.timeStarted}</td>
                                <td>{value.timeLeft}</td>
                                <td>{value.status}</td>
                            </tr>
                        ))
                    ))
                }
                </tbody>
            </table>
        </div>
    );

}
