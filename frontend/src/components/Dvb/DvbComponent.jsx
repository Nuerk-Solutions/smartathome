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

    const calcAmount = Math.floor((window.innerHeight - 60 - 70 - 72) / 66); // Header, Titlebar, footer

    const {stop = name, amount = window.innerHeight <= 600 ? 6 : calcAmount, offset = 0} = useParams();

    const {theme, colorTheme} = useContext(ThemeContext)

    let refreshDelay = 31 * 10; //30 seconds
    const progress = seconds * 100 / refreshDelay - 1;

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
            <div className={`text-${colorTheme} shadow-lg shadow-2xl`}
                 style={{
                     backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
                 }}>
                <h1 className={"shadow-lg shadow-2xl p-5 mb-5"} style={{
                    backgroundColor: theme === 'dark' ? '#424242' : '#929292',
                }}>{name}</h1>
                <table className="w-full table-auto mb-5">
                    <tbody>

                    {json.map((linie, index) => (
                        <tr key={index}>
                            <td className="text-center pr-5 ">
                                <LinienIconComponent name={linie.mode.name} linie={linie.line}/>
                            </td>
                            <td className="w-1/2">
                                <div className={""}>{linie.direction}</div>
                                {linie.platform &&
                                <div className={"-mt-1 text-sm"}>Steig {linie.platform.name}</div>
                                }
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
        <div className={`${props.name.toLowerCase()} ml-2`}>
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
                <div className="pt-1 mr-0.5 flex justify-left items-center">
                    <DepartureStatusIconComponent
                        state={props.linie.state}
                        delayTime={props.linie.delayTime}/>

                    {props.linie.state !== "Canceled" &&
                    <div className={props.linie.state === "Delayed" ? "text-sm ml-1.5 text-red-700" : "text-sm ml-1.5"}>
                        {destinationTime.toLocaleTimeString([], {timeStyle: 'short'}) + " Uhr"}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

function DepartureStatusIconComponent(props) {
    switch (props.state) {
        case "InTime":
            return (
                <CheckCircleIcon style={{color: '#369617FF'}} className={"transform scale-75 -ml-0.5"}/>
            );
        case "Delayed":
            return (
                <div className="text-red-700 flex transform scale-75 -ml-2">
                    <WarningIcon/>
                    <div>+{props.delayTime}</div>
                    <EventNoteIcon className={"ml-4 -mr-4"}/>
                </div>
            );
        case "Canceled":
            return (
                <div className="text-orange-500 flex transform scale-75 -ml-3">
                    <CancelIcon/>
                    <div className={"ml-2 -mr-2"}>Fällt aus</div>
                </div>
            );
        default:
            return (
                <HelpIcon className={"transform scale-75 -ml-0.5"}/>
            )
    }
}
