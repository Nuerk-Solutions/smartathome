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
import './../assets/css/dvb.css';

export function DvbWidget(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);
    const [seconds, setSeconds] = useState(-1);

    const [name, setName] = useState(props.name);
    const [stopID, setStopID] = useState(null);

    const {stop = name, amount = 15, offset = 0} = useParams();

    let refreshDelay = 31 * 10; //30 seconds
    const progress = seconds * 100 / 300;

    useEffect(() => {
        dvb.findStop(stop).then((data) => {
            setName(data[0].name);
            getDvbData(data[0].id);
        }, () => { //Default handling, when dvb#findStop returns no result
            getDvbData("33000146");
        });
    }, []);


    useEffect(() => {
        const timer = seconds <= refreshDelay && setInterval(() => setSeconds(seconds + 1), 100); // 1000ms = 1sec
        if (seconds > refreshDelay) {
            getDvbData(stopID);
            setSeconds(0);
        }
        return () => clearInterval(timer);

    }, [seconds, json]);

    if (error) {
        return (
            <StateVisualComponent
                title={"Fehler"}
                content={<h2>{error.message}</h2>}
            />
        );
    } else if (!isLoaded) {
        return (
            <StateVisualComponent
                title={name}
                content={<LoadingSpinner style="spinner-pos"/>}
            />
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
                            <td className="linie-tr">
                                <LinienIconComponent name={linie.mode.name} linie={linie.line}/>
                            </td>
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
                <LinearProgress variant="determinate" color="secondary" value={progress >= 102 ? 0 : progress}/>
            </div>
        );
    }

    function getDvbData() {
        setStopID(arguments[0]);
        dvb.monitor(arguments[0], offset, amount)
            .then(result => {
                    setError(null);
                    setJson(result);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }
}

function StateVisualComponent(props) {
    return (
        <div>
            <div className="monitor-div">
                <h1>{props.title}</h1>
                <div className="main-div dropShadow">
                    {props.content}
                </div>
            </div>
        </div>
    );
}

function LinienIconComponent(props) {
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
            <div>{timeDifferenz > 0 ? "in " + (timeDifferenz > 90 ? Math.floor(timeDifferenz / 60) + " St." : timeDifferenz + " Min.") : timeDifferenz < 0 && props.linie.state === "InTime" ? "Vor Zeitplan" : "Jetzt"}</div>
            <div>
                <div className="statusIcon">
                    <DepartureStatusIconComponent
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

function DepartureStatusIconComponent(props) {
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
            //Actually can be removed
        case "Unknown":
            return (
                <HelpIcon className="unknownIcon" style={{fontSize: 15}}/>
            )
        default:
            return (
                <HelpIcon className="unknownIcon" style={{fontSize: 15}}/>
            )
    }
}
