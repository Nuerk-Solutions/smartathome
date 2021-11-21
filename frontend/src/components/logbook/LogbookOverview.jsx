import React, {useContext, useEffect, useMemo, useState} from "react";
import {useSortBy, useTable} from "react-table";
import {isEven} from "../../utils/NumberUtils";
import {ThemeContext} from "../../context/ThemeContext";
import axois from "axios";
import LoaderComponent from "../weather/loader/LoaderComponent";
import axios from "axios";
import './overViewTable.css';


export default function () {

    const [logbook, setLogbook] = useState([]);
    const {theme, colorTheme} = useContext(ThemeContext);
    const [isLoaded, setIsLoaded] = useState(false);

    // convert a number into a readable german format
    const formatNumber = (number) => {
        return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(async () => {
        await axois.get("http://192.168.200.184:2000/logbook").then(res => {
            setLogbook(res.data.map(item => {
                return {
                    ...item,
                    date: new Date(item.date).toLocaleDateString(),
                    vehicle: {
                        ...item.vehicle,
                        newMileAge: (formatNumber(item.vehicle.newMileAge) || '0') + 'km',
                        currentMileAge: (formatNumber(item.vehicle.currentMileAge) || '0') + 'km',
                        distance: (formatNumber(item.vehicle.distance) || '0') + 'km',
                        cost: (item.vehicle.cost || '0') + '€'
                    }
                }
            }));
            setIsLoaded(true);
        });
    }, []);


    const handleDownload = async () => {
        await axios.get('http://localhost:2000/logbook?dl=1', {responseType: 'blob'}).then(res => {
            downloadFile(res);
        }).catch(err => console.log(err));
    }


    const downloadFile = (res) => {
        const contentDisposition = res.headers['content-disposition'];
        const fileName = contentDisposition.split(';')[1].split('=')[1];

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
    }

    const data = useMemo(() => [...logbook], [logbook])
    const tableColumns = useMemo(() => [
        {
            Header: 'Datum',
            accessor: 'date', // accessor is the "key" in the data
        },
        {
            Header: 'Grund',
            accessor: 'reasonForUse',
        },
        {
            Header: 'Fahrer',
            accessor: 'driver',
        },
        {
            Header: 'Auto',
            accessor: 'vehicle.typ',
        },
        {
            Header: 'Akuteller Kilometerstand',
            accessor: 'vehicle.currentMileAge',
        },
        {
            Header: 'Neuer Kilometerstand',
            accessor: 'vehicle.newMileAge',
        },
        {
            Header: 'Distance',
            accessor: 'vehicle.distance',
        },
        {
            Header: 'Kosten',
            accessor: 'vehicle.cost',
        }
    ], [])

    const tableInstance = useTable({
        columns: tableColumns, data,
    }, useSortBy)
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;

    if (!isLoaded) {
        return (
            <LoaderComponent loaderText={`Abrufen der neusten Daten 😎`}/>
        );
    } else
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                    }>
                    <div className={`text-${colorTheme} flex flex-col items-center`}>
                        <h1 className="text-2xl font-bold mb-8 mt-8">Fahrtenbuch - Überblick</h1>
                        <table {...getTableProps()} >
                            <thead style={{
                                backgroundColor: theme === 'dark' ? '#424242' : '#929292',
                            }}>
                            {headerGroups.map(headerGroup => (
                                <tr
                                    {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column =>
                                        (
                                            <th className={"p-2 "}  {...column.getHeaderProps(column.getSortByToggleProps())} >
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
                                    <tr {...row.getRowProps()} >
                                        {row.cells.map(cell => {
                                            return (
                                                <td {...cell.getCellProps()}
                                                    className={`p-2 text-center ${isEven(index) ?
                                                        theme === 'dark' ? 'bg-pink-400' : 'bg-pink-400' :
                                                        theme === 'dark' ? 'bg-pink-200' : 'bg-pink-200'}`}>
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <button
                            id="button"
                            type="submit"
                            className="w-auto px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-deep-orange-500 hover:bg-deep-orange-600 hover:shadow-lg focus:outline-none"
                            onClick={handleDownload}
                        >
                            Download XLSX
                        </button>
                    </div>
                </Suspense>
            </Fragment>
        )

}
