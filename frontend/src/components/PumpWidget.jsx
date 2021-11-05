import React, {createRef, useContext, useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from "react-table";
import axios from "axios";
import {CircleCountDownOwn} from "./CircleCountDownOwn";
import {useHistory, useLocation} from "react-router-dom";
import {ThemeContext} from "../context/ThemeContext";

export function PumpWidget() {

    const [json, setJson] = useState(null);
    const [duration, setDuration] = useState(0);
    let ref = createRef();
    const history = useHistory();
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
            }, duration * 1000);
        }
    }, [duration]);


    const createNewTask = async (duration) => {
        axios.post("http://localhost:2000/pump/timers", {duration: duration}).then(result => {
            setJson(result.data);
            console.log(result.data);
            if (result.data) {
                if (params.get("id") !== null)
                    params.delete("id");
                params.append("id", result.data.id)
            } else {
                params.delete("id")
            }
            history.push({search: params.toString()})
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
        return props.map(item => (
            {
                ...item,
                duration: Math.round(item.duration / 1000 >= 60 ? item.duration / 1000 / 60 : item.duration / 1000),
                startDate: new Date(item.startDate).toLocaleString(),
                endDate: new Date(item.endDate).toLocaleString(),
                completed: item.completed ? "Ja" : "Nein",
                remainingTime: item.completed ? "-" : new Date(item.endDate - Date.now() - 3600000).toLocaleTimeString()
            }
        ))
    }

    useEffect(() => {
        fetchTimers();
        getTaskByParameter();
    }, []);

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
            <input
                ref={ref}
            />
            <button onClick={() => setDuration(ref.current.value)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Start
            </button>
    <div>
        {(json && json.endDate > Date.now()) && (
            <CircleCountDownOwn
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
