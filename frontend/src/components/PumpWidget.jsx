import React, {createRef, useContext, useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from "react-table";
import axios from "axios";
import {CircleCountDownOwn} from "./CircleCountDownOwn";
import {useHistory, useLocation} from "react-router-dom";
// import './tailwind.scss'
import {ThemeContext} from "../context/ThemeContext";

export function PumpWidget() {

    const [json, setJson] = useState([]);
    const [duration, setDuration] = useState(0);
    let ref = createRef();
    const history = useHistory();
    const search = useLocation();

    const [timers, setTimers] = useState([]);
    const {theme, colorTheme} = useContext(ThemeContext)

    useEffect(() => {
        if(duration !== 0) {
            createNewTask(duration);
        }
    }, [duration]);


    const createNewTask = async (duration) => {
        console.log(duration)
        const params = new URLSearchParams(search.search)
        axios.post("https://api.nuerk-solutions.de/pump/timers", {duration: duration}).then(result => {
            setJson(result.data);
            console.log(result.data);
            if (result.data) {
                params.append("id", result.data.id)
            } else {
                params.delete("id")
            }
            history.push({search: params.toString()})
        });
    }

    const getTaskByParameter = async () => {
        if (params.get("id")) {
            axios.get(`https://api.nuerk-solutions.de/pump/timers/${params.get("id")}`).then(result => {
                setJson(result.data);
            });
        }
    }

    const fetchTimers = async () => {
        const response = await axios.get(`https://api.nuerk-solutions.de/pump/timers`).catch(err => console.error(err));

        if (response) {
            const timers = convertJson(response.data);
            setTimers(timers);
        }
    }

    

    function convertJson(props) {
        return props.map(item => (
            {
                ...item,
                duration: Math.round(item.duration >= 60 ? item.duration / 60 : item.duration),
                startDate: new Date(item.startDate * 1000).toLocaleString(),
                endDate: new Date(item.endDate * 1000).toLocaleString(),
                completed: item.completed ? "Ja" : "Nein",
                remainingTime: item.completed ? "-" : new Date(((item.endDate * 1000) - (Date.now())) - 3600000).toLocaleTimeString()
            }
        ))
    }

    // useEffect(() => {
    //     fetchTimers();
    // }, []);

    const data = useMemo(
        () => [...timers],
        [timers]
    )

    const columns = useMemo(
        () => [
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
            },
        ],
        []
    )

    const tableInstance = useTable(
        {
            columns: columns,
            data: data
        },
        useSortBy
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    const isEven = (idx) => idx % 2 === 0;

    return (
        <div>
            <div className="md-input-main mt-5 flex">
                <div className="md-input-box">
                    <input
                        id="fullName"
                        name="fullName"
                        type="number"
                        className="md-input"
                        placeholder=" "
                        ref={ref}
                    />
                    <label htmlFor="fullName" className="md-label">Duration</label>
                    <div className="md-input-underline"/>
                </div>
                <button onClick={() => setDuration(ref.current.value)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Start
                </button>
            </div>
            <CircleCountDownOwn startTime={json.startDate}
                                endTime={json.endDate}
                                fullTimeDuration={json.duration}
                                colorRemainingTime={`${colorTheme === 'light' ? '#F7f8f9' : '#181818'}`}/>
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
