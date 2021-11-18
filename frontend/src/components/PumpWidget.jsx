import React, {createRef, useContext, useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from "react-table";
import axios from "axios";
import {CircleCountDown} from "./CircleCountDown";
import {useLocation, useHistory} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {isEven} from "../utils/NumberUtils";
import {convertMillisecondsToReadableFormat} from "../utils/TimeUtils";
import isValid from "../utils/ValidityChecker";
import './weather/pump.scss'

export function PumpWidget() {

    const [json, setJson] = useState(null);
    const [duration, setDuration] = useState(0);
    const [animation, setAnimation] = useState(false);
    let ref = createRef();
    const history = useHistory();
    const search = useLocation();

    const [timers, setTimers] = useState([]);
    const {theme, colorTheme} = useContext(ThemeContext);
    const params = new URLSearchParams(search.search);

    useEffect(async () => {
        if (duration !== 0) {
            await createNewTimer(duration);
            setTimeout(async () => {
                setDuration(0);
                await fetchTimersReadable();
            }, duration);
        }
    }, [duration]);

    useEffect(async () => {
        await getTimerById();
        await fetchTimersReadable(); //Todo : order and conclusion of both methods
    }, []);

    useEffect(() => {
        fetchTimersReadable();
    }, [duration]);

    const createNewTimer = async (duration) => {
        axios.post("https://api.nuerk-solutions.de/pump/timers", {duration: duration}).then(result => {
            setJson(result.data)
            if (result.data) {
                if (params.get("id") !== null)
                    params.delete('id');
                params.append("id", result.data.id);
            }
            history.push({search: params.toString()})
        });
    }

    const getTimerById = async () => {
        if (params.get("id")) {
            axios.get(`https://api.nuerk-solutions.de/pump/timers/${params.get("id")}`).then(result => {
                setJson(result.data);
                if (result.data.completed) {
                    setTimeout(() => {
                        setDuration(0);
                        fetchTimersReadable();
                    }, result.data.endDate - Date.now());
                } else {
                    params.delete('id');
                    history.push({search: params.toString()})
                }
            });
        }
    }

    const fetchTimersReadable = async () => {
        const response = await axios.get(`https://api.nuerk-solutions.de/pump/timers`);

        if (response) {
            const timers = response.data.map(item => {
                return ({
                    ...item,
                    duration: convertMillisecondsToReadableFormat(item.duration),
                    startDate: new Date(item.startDate).toLocaleString(),
                    endDate: new Date(item.endDate).toLocaleString(),
                    completed: item.completed ? "Ja" : "Nein",
                    remainingTime: item.completed ? "-" : new Date(item.endDate - Date.now() - 3600000).toLocaleTimeString()
                })
            });
            setTimers(timers);
        }
    }


    // React Table
    const data = useMemo(() => [...timers], [timers])
    const tableColumns = useMemo(() => [
        {
            Header: 'Id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Länge',
            accessor: 'duration',
        },
        {
            Header: 'Startzeit',
            accessor: 'startDate',
        },
        {
            Header: 'Endzeit',
            accessor: 'endDate',
        },
        {
            Header: 'Verbliebene Zeit',
            accessor: 'remainingTime',
        },
        {
            Header: 'Beendet',
            accessor: 'completed',
        }
    ], [])
    const tableInstance = useTable({columns: tableColumns, data: data}, useSortBy)
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;

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
                            onClick={() => {
                                setAnimation(true);
                                setDuration((ref.current.value * 60) * 1000)
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
            <table {...getTableProps()} className={"w-screen"}>
                <thead style={{
                    backgroundColor: theme === 'dark' ? '#424242' : '#929292',
                }}>
                {headerGroups.map(headerGroup => (
                    <tr
                        {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th className={"p-2"}  {...column.getHeaderProps(column.getSortByToggleProps())} >
                                {column.render('Header')}
                                {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}
                                        className={`p-2 text-center ${isEven(index) ?
                                            theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-300' :
                                            theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-200'}`}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}
