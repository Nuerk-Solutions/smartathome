import React, {useEffect, useState} from 'react';
import * as dvb from "dvbjs";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LoadingSpinner from "../assets/components/LoadingSpinner";
import {LinearProgress} from "@material-ui/core";
import {useParams} from "react-router-dom";

//HBF: 33000028
//Malterstraße: 33000146
// const stopID = "33000146"; // Malterstraße

export function DvbWidget(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);
    const [seconds, setSeconds] = useState(-1);
    const [name, setName] = useState(props.name);
    const { stop = name, amount = 15, offset = 0 } = useParams();
    const [stopID, setStopID] = useState("33000146");

    let timeout = 100;
    let refreshDelay = 31 * 10; //30 seconds
    const progress = seconds * 100 / 300;

    useEffect(() => {
        dvb.findStop(stop).then((data) => {
            console.log(JSON.stringify(data));
            setName(data[0].name);
            setStopID(data[0].id);
        });
    }, [name]);

    useEffect(() => {
        // const timer = seconds >= 0 && setInterval(() => setSeconds(seconds - 1), 1000);
        const timer = seconds <= refreshDelay && setInterval(() => setSeconds(seconds + 1), timeout);
        if (seconds > refreshDelay) {
            setSeconds(0);
            dvb.monitor(stopID, offset, amount)
                .then(result => {
                        setError(null);
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
        return (
            <div>
                <div className="monitor-div">
                    <h1>Fehler</h1>
                    <div className="main-div dropShadow">
                        <h2>{error.message}</h2>
                    </div>
                </div>
            </div>
        );
    } else if (!isLoaded) {
        return (
            <div>
                <div className="monitor-div">
                    <h1>{name}</h1>
                    <div className="main-div dropShadow">
                        <LoadingSpinner style="spinner-pos"/>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="monitor-div">
                <h1>{name}</h1>
                <table className="table-dvb" cellSpacing="10">
                    <tbody>
                    {json.map(linie => (
                        <tr key={linie.id + linie.scheduledTime.getTime()}
                            id={linie.id + linie.scheduledTime.getTime()}>
                            <td className="linie-tr"><LinienIcon name={linie.mode.name} linie={linie.line}/></td>
                            <td>
                                <div>{linie.direction}</div>
                                <small>Steig </small>
                            </td>
                            <td>
                                <DepartureComponent linie={linie}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p>Nächste Aktualisierung in {Math.floor(seconds / 10)} sekunden.</p>
                <LinearProgress variant="determinate" color="secondary" value={progress >= 102 ? 0 : progress}/>
            </div>
        );
    }
}

function LinienIcon(props) {
    return (
        <div className={props.name.toLowerCase()}>
            {props.linie}
        </div>
    );
}

function DepartureComponent(props) {
    const destinationTime = props.linie.arrivalTime || props.linie.scheduledTime;
    const timeDifferenz = props.linie.arrivalTimeRelative || props.linie.scheduledTimeRelative;

    return (
        <div>
            <div>{timeDifferenz > 0 ? "in " + (timeDifferenz > 90 ? Math.floor(timeDifferenz / 60) + " St." : timeDifferenz + " Min.") : "Jetzt"}</div>
            <div>
                <div className="statusIcon">
                    <DepartureStatusIcon
                        state={props.linie.state}
                        delayTime={props.linie.delayTime}/>
                </div>
                {props.linie.state !== "Canceled" &&
                <small className={props.linie.state === "Delayed" ? "delayedIcon" : ""}>
                    {destinationTime.toLocaleTimeString([], {timeStyle: 'short'}) + " Uhr"}
                </small>
                }
            </div>
        </div>
    );
}

//Todo: To early by subtraction arrival time to planned time
function DepartureStatusIcon(props) {
    switch (props.state) {
        case "InTime":
            return (
                <CheckCircleIcon className="onTimeIcon" style={{fontSize: 15}}/>
            );
        case "Delayed":
            return (
                <div className="delayedIcon">
                    <WarningIcon style={{fontSize: 15}}/>
                    <small className="delayTime">+{props.delayTime}</small>
                    <EventNoteIcon className="delayCalenderIcon" style={{fontSize: 15}}/>
                </div>
            );
        case "Canceled":
            return (
                <div className="cancelIcon">
                    <CancelIcon style={{fontSize: 15}}/>
                    <small className="cancelText">Fällt aus</small>
                </div>
            );
        case "Unknown":
            return (
                <HelpIcon className="unknownIcon" style={{fontSize: 15}}/>
            )
        default:
            return (
                <div>No State</div>
            );
    }
}
