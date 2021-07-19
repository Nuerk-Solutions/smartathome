import React, {useEffect, useState} from 'react';
import * as dvb from "dvbjs";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LoadingSpinner from "../components/LoadingSpinner";

//HBF: 33000028
//Malterstraße: 33000146

const stopID = "33000028"; // Malterstraße
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
                    <h1>{props.name}</h1>
                    <div className="main-div dropShadow">
                        <LoadingSpinner style="spinner-pos"/>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="monitor-div">
                <h1>{props.name}</h1>
                <table className="table-dvb" cellSpacing="10">
                    <tbody>
                    {json.map(linie => (
                        <tr key={linie.id + linie.scheduledTime.getTime()}
                            id={linie.id + linie.scheduledTime.getTime()}>
                            <td className="linie-tr"><LinienIcon name={linie.mode.name} linie={linie.line}/></td>
                            <td>
                                <div>{linie.direction}</div>
                                <small>Steig {linie.platform.name}</small>
                            </td>
                            <td>
                                <DepartureComponent linie={linie}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p>Nächste Aktualisierung in {seconds} sekunden.</p>
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
