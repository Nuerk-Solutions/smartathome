import React, {createRef, useContext, useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from "react-table";
import axios from "axios";
import {CircleCountDown} from "./CircleCountDown";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";

export function PumpWidget() {

    const [json, setJson] = useState(null);
    const [duration, setDuration] = useState(0);
    let ref = createRef();
    const history = useNavigate();
    const search = useLocation();

    const [timers, setTimers] = useState([]);
    const {theme, colorTheme} = useContext(ThemeContext)
    const params = new URLSearchParams(search.search)

    useEffect(() => {
        if (duration !== 0) {
            createNewTask(duration);
            setTimeout(() => {
                setDuration(0);
                fetchTimers();
            }, duration);
        }
    }, [duration]);


    const createNewTask = async (duration) => {
        axios.post("http://localhost:2000/pump/timers", {duration: duration}).then(result => {
            setJson(result.data);
            console.log(result.data);
            if (result.data) {
                if (params.get("id") !== null)
                    history("/pump");
                history({
                    pathname: "/pump",
                    search: `?${createSearchParams({
                        id: result.data.id
                    })}`
                });
            } else {
                history("/pump");
            }
            // history.push({search: params.toString()})
        });
    }

    const getTaskByParameter = async () => {
        if (params.get("id")) {
            axios.get(`http://localhost:2000/pump/timers/${params.get("id")}`).then(result => {
                setJson(result.data);
                const duration = result.data.endDate - Date.now();
                setTimeout(() => {
                    setDuration(0);
                    fetchTimers();
                }, duration);
            });
        }
    }

    const fetchTimers = async () => {
        const response = await axios.get(`http://localhost:2000/pump/timers`).catch(err => console.error(err));

        if (response) {
            const timers = convertJson(response.data);
            setTimers(timers);
        }
    }


    function convertJson(props) {
        return props.map(item => {
                const duration = item.duration / 1000000;
                return ({
                    ...item,
                    duration: Math.round(duration >= 60 ? duration / 60 : duration),
                    startDate: new Date(item.startDate).toLocaleString(),
                    endDate: new Date(item.endDate).toLocaleString(),
                    completed: item.completed ? "Ja" : "Nein",
                    remainingTime: item.completed ? "-" : new Date(item.endDate - Date.now() - 3600000).toLocaleTimeString()
                })
            }
        )
    }

    useEffect(() => {
        fetchTimers();
        getTaskByParameter();
    }, []);

    const data = useMemo(
        () => [...timers],
        [timers]
    )

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

    const tableInstance = useTable(
        {
            columns: tableColumns,
            data: data
        },
        useSortBy)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    const isEven = (idx) => idx % 2 === 0;

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
                        startTime={json.startDate}
                        endTime={json.endDate}
                        fullTimeDuration={json.duration}
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
                                    background: 'aliceblue',
                                    color: 'black',
                                    fontWeight: 'bold',
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
                                        style={{
                                            padding: '10px',
                                            border: 'solid 1px gray',
                                            background: isEven(index) ? 'papayawhip' : 'lightgray',
                                        }}
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
