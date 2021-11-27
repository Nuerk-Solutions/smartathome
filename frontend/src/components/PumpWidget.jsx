import React, {createRef, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {CircleCountDown} from "./CircleCountDown";
import {useHistory, useLocation} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import './weather/pump.scss'

export function PumpWidget() {

    const [json, setJson] = useState(null);
    const [duration, setDuration] = useState(0);
    const [animation, setAnimation] = useState(false);
    let ref = createRef();
    const history = useHistory();
    const search = useLocation();

    const {theme, colorTheme} = useContext(ThemeContext);
    const params = new URLSearchParams(search.search);

    useEffect(async () => {
        await getTimerById();
    }, [duration]);

    const createNewTimer = async (duration) => {
        axios.post("https://api.nuerk-solutions.de/pump/timers", {duration: duration}).then(result => {
            setJson(result.data);
            if (result.status === 200) {
                if (result.data) {
                    if (params.get("id") !== null)
                        params.delete('id');
                    params.append("id", result.data.id);

                    // set Timout for animation
                    setTimeout(async () => {
                        setDuration(0);
                        setAnimation(false);
                        document.getElementById("timerForm").hidden = false;
                        document.getElementById("timerClock").hidden = true;
                    }, duration);
                }
            }
            history.push({search: params.toString()})
        });
    }

    const getTimerById = async () => {
        // if (params.get("id")) {
        //     axios.get(`https://api.nuerk-solutions.de/pump/timers/${params.get("id")}`).then(result => {
        //         setJson(result.data);
        //         if (result.data.completed) {
        //             // set Timout for animation
        //             setTimeout(() => {
        //                 setDuration(0);
        //                 setAnimation(false);
        //             }, result.data.endDate - Date.now());
        //         } else {
        //             params.delete('id');
        //             history.push({search: params.toString()})
        //         }
        //     });
        // } else {
            axios.get(`https://api.nuerk-solutions.de/pump/timers`).then(result => {
                const json = result.data.sort((a, b) => {
                    return a.completed - b.completed;
                });
                setJson(json[0]);
                setAnimation(true);
                if (result.data) {
                    // set Timout for animation

                    params.delete('id');
                    params.append("id", json[0].id);
                    history.push({search: params.toString()})
                    setTimeout(() => {
                        setDuration(0);
                        setAnimation(false);
                        document.getElementById("timerForm").hidden = false;
                        document.getElementById("timerClock").hidden = true;
                    }, json[0].endDate - Date.now());
                }
            });
        // }
    }

    return (
        <div className={`text-${colorTheme}`}
             data-theme={`${theme}`}
            // style={{
            //     backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
            // }}
        >
            <div id="timerForm" className={`${animation && "fade-out" || ""} p-0 p-12`}
                 onAnimationEnd={() => {
                     // setAnimation(false);
                     document.getElementById("timerForm").hidden = true;
                     document.getElementById("timerClock").hidden = false;
                 }}>
                <div className={`mx-auto max-w-md px-6 py-12 border-0 shadow-lg rounded-2xl`}
                     style={{
                         backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
                     }}>
                    <h1 className="text-2xl font-bold mb-8">Pumpentimer</h1>
                    <form id="form" noValidate>
                        <div className="relative z-0 w-full mb-5">
                            <input
                                type="number"
                                name="duration"
                                placeholder=" "
                                className={`pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-${colorTheme} border-gray-500`}
                                ref={ref}
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-500">min</div>
                            <label
                                className={`absolute duration-300 top-3 -z-1 origin-0 text-gray-500 focus:border-${colorTheme}`}>Länge</label>
                            <span className="text-sm text-red-600 hidden" id="error">Länge wird benötigt</span>
                        </div>

                        <button
                            id="button"
                            type="button"
                            className={`w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-indigo-500 transition duration-500 ease-in-out hover:bg-green-600 hover:shadow-lg transform hover:scale-105 focus:outline-none`}
                            onClick={async () => {
                                if(ref.current.value > 0) {
                                    setAnimation(true);
                                    await createNewTimer((ref.current.value * 60) * 1000)
                                }
                            }}
                        >
                            Timer Starten
                        </button>
                    </form>
                </div>
            </div>

            <div id="timerClock" hidden
                 className={`${animation === true && "fade-in" || ""} mx-auto max-w-md px-6 py-12 border-0 shadow-lg rounded-2xl mt-5 mb-5`}
                 style={{
                     backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
                 }}>
                {(json && json.endDate > Date.now()) && (
                    <CircleCountDown
                        // startTime={json.startDate}
                        endTime={json.endDate}
                        // endTime={0}
                        fullTimeDuration={json.duration}
                        colorRemainingTime={`${colorTheme === 'light' ? '#F7f8f9' : '#181818'}`}/>
                )}
            </div>
        </div>
    )
}
