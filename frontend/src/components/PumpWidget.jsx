import React, {createRef, useContext, useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from "react-table";
import axios from "axios";
import {CircleCountDown} from "./CircleCountDown";
import {useLocation, useHistory} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";
import {isEven} from "../utils/NumberUtils";
import {convertMillisecondsToReadableFormat} from "../utils/TimeUtils";

export function PumpWidget() {

    const [json, setJson] = useState(null);
    const [duration, setDuration] = useState(0);
    let ref = createRef();
    const history = useHistory();
    const search = useLocation();

    const [timers, setTimers] = useState([]);
    const {theme, colorTheme} = useContext(ThemeContext)
    const params = new URLSearchParams(search.search)

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
        await fetchTimersReadable();
        await getTimerById();
    }, []);

    const createNewTimer = async (duration) => {
        axios.post("http://localhost:2000/pump/timers", {duration: duration}).then(result => {
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
            axios.get(`http://localhost:2000/pump/timers/${params.get("id")}`).then(result => {
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
        const response = await axios.get(`http://localhost:2000/pump/timers`);

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
        <div className={`text-${colorTheme} shadow-lg shadow-2xl`}
             style={{
                 backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
             }}>
            <div className={"flex-auto"}>
                <input
                    className={"border-sun border-2 border-solid"}
                    style={{
                        backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
                    }}
                    placeholder={"Länge in Sekunden"}
                    ref={ref}
                />
                <button onClick={() => setDuration(ref.current.value * 1000)}>
                    Start
                </button>
            </div>

            <div>
                {(json && json.endDate > Date.now()) && (
                    <CircleCountDown
                        // startTime={json.startDate}
                        endTime={json.endDate}
                        // fullTimeDuration={json.duration}
                        colorRemainingTime={`${colorTheme === 'light' ? '#F7f8f9' : '#181818'}`}/>
                )}
            </div>
            <table {...getTableProps()} style={{border: 'solid 1px blue'}}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                style={{
                                    borderBottom: 'solid 3px red',
                                    background: theme === 'dark' ? '#424242' : '#929292',
                                    fontWeight: 'medium',
                                }}
                            >
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
                                        className={`p-2.5 border-2 border-gray-400 ${isEven(index) ? theme === 'dark' ? 'bg-dark' : 'bg-light' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-500'}`}
                                    >
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
