import React, {useContext, useEffect, useState} from 'react';
import * as dvb from "dvbjs";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinnerComponent";
import {useParams} from "react-router-dom";
import './Dvb.css';
import {LinearProgress} from "@mui/material";
import {ThemeContext} from "../../context/ThemeContext";


export function DvbWidget(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);
    const [seconds, setSeconds] = useState(-1);

    const [name, setName] = useState(props.name);
    const [stopID, setStopID] = useState(null);

    const {stop = name, amount = 15, offset = 0} = useParams();

    const {theme, colorTheme} = useContext(ThemeContext)

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
                theme={theme}
                colorTheme={colorTheme}
            />
        );
    } else if (!isLoaded) {
        return (
            <StateVisualComponent
                title={name}
                content={<LoadingSpinner/>}
                theme={theme}
                colorTheme={colorTheme}
            />
        );
    } else {
        return (
            <div className={`text-${colorTheme} pb-3`}
                 style={{
                     backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
                 }}>
                <h1>{name}</h1>
                <table className="w-full shadow-lg table-auto">
                    <tbody>

                    {json.map((linie, index) => (
                        <tr key={index}>
                            <td className="text-center pr-5 ">
                                <LinienIconComponent name={linie.mode.name} linie={linie.line}/>
                            </td>
                            <td className="w-1/2">
                                <div className={""}>{linie.direction}</div>
                                <div className={"-mt-1 text-sm"}>Steig {linie.platform.name}</div>
                            </td>
                            <td className={"w-1/2"}>
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
    console.log(props.theme);
    return (
        <div>
            <div className={`text-${props.colorTheme} pb-3`}
                 style={{
                     backgroundColor: props.theme === 'dark' ? '#292929' : '#e8ebee',
                 }}>
                <h1>{props.title}</h1>
                <div className="grid justify-center">
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
            <div>{timeDifferenz > 0 ? "in " + (timeDifferenz > 90 ? Math.floor(timeDifferenz / 60) + " St." : timeDifferenz + " Min.") : timeDifferenz < 0 && props.linie.state === "InTime" ? Math.abs(timeDifferenz) + " min vor Zeitplan" : "Jetzt"}</div>
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
