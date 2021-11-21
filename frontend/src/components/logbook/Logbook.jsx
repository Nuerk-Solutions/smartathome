import React, {Fragment, Suspense, useMemo, useState} from 'react';
import axois from 'axios';

import '../weather/pump.scss'
import moment from "moment-timezone";
import {useHistory} from "react-router-dom";
import useQueryParam from "../../utils/useQueryParam";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LoaderComponent from "../weather/loader/LoaderComponent";

export default function () {

    const [isLoaded, setIsLoaded] = useState(false);
    const [driver, setDriver] = useState(-1);
    const [vehicle, setVehicle] = useState('1');
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [reason, setReason] = useState('Stadtfahrt');
    const [currentMileAge, setCurrentMileAge] = useState('');
    const [newMileAge, setNewMileAge] = useState('');
    const [vehicleData, setVehicleData] = useState([]);
    const MySwal = withReactContent(Swal);
    const history = useHistory();

    const fetchData = async () => {
        axios.get("https://api.nuerk-solutions.de/logbook?typ=VW").then(res => {
            if (res.data) {
                setVehicleData(res.data);
                if (res.data[0])
                    setCurrentMileAge(res.data[0].vehicle.newMileAge || '');
                setIsLoaded(true);
            }
        });
    };

    useMemo(async () => {
        await fetchData();
    }, []);

    const updateVehicleData = () => {
        switch (vehicle) {
            case '2':
                if (vehicleData[0])
                    setCurrentMileAge(vehicleData[0].vehicle.newMileAge);
                else setCurrentMileAge('');
                break;
            case '1':
                if (vehicleData[1])
                    setCurrentMileAge(vehicleData[1].vehicle.newMileAge);
                else setCurrentMileAge('');
                break;
        }
    }

    // convertDriver Index starting by 1 to Driver Name Andrea, Claudia, Oliver, Thomas, default -1
    const convertDriver = (index) => {
        switch (+index) {
            case 1:
                return 'Andrea';
            case 2:
                return 'Claudia';
            case 3:
                return 'Oliver';
            case 4:
                return 'Thomas';
            default:
                return '-1';
        }
    }

    // convertVehicle Index starting by 1 to Vehicle Name VW, Ferrari, default ''
    const convertVehicle = (index) => {
        switch (+index) {
            case 1:
                return 'VW';
            case 2:
                return 'Ferrari';
            default:
                return '';
        }
    }


    // post request to http:localhost:2000/api/logbook new logbook entry as json
    // if error, display error message
    // use axois
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axois.post('https://api.nuerk-solutions.de/logbook', {
            driver: convertDriver(driver),
            vehicle: {
                typ: convertVehicle(vehicle),
                currentMileAge,
                newMileAge
            },
            date,
            reasonForUse: reason
        })
            .then(response => {
                if (response.status === 200) {
                    MySwal.fire({
                        title: <p>Neue Fahrt hinzugefügt</p>,
                        icon: 'success',
                        footer: 'Fenster schließt in 5 Sekunden',
                        timerProgressBar: true,
                        timer: 5000,
                    }).then(async () => {
                        setIsLoaded(false);
                        await fetchData();
                        setDriver(-1);
                        setVehicle('0');
                        setDate(moment().format('YYYY-MM-DD'));
                        setReason('');
                        setCurrentMileAge('');
                        setNewMileAge('');
                    });
                }
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

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
                    <div className="bg-gray-100 p-0 sm:p-12">
                        <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                            <h1 className="text-2xl font-bold mb-8">Fahrtenbuch</h1>
                            <form id="form" onSubmit={handleSubmit}>
                                <div className="relative z-0 w-full mb-5">
                                    <select
                                        required
                                        name="driver"
                                        value={driver}
                                        onChange={(event) => setDriver(event.target.value)}
                                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    >
                                        <option value="-1" disabled hidden/>
                                        <option value="1">Andera</option>
                                        <option value="2">Claudia</option>
                                        <option value="3">Oliver</option>
                                        <option value="4">Thomas</option>
                                    </select>
                                    <label htmlFor="select"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Fahrer
                                        auswählen</label>
                                    <span className="text-sm text-red-600 hidden"
                                          id="error">Option has to be selected</span>
                                </div>
                                <fieldset className="relative z-0 w-full p-px mb-5 border-0">
                                    <legend
                                        className="absolute text-gray-500 transform scale-75 -top-3 origin-0">Fahrzeug
                                        auswählen
                                    </legend>
                                    <div className="block pt-3 pb-2 space-x-4">
                                        <label>
                                            <input
                                                required
                                                checked={vehicle === '1'}
                                                onChange={(event) => {
                                                    setVehicle(event.target.value)
                                                    updateVehicleData();
                                                }}
                                                type="radio"
                                                name="vehicle"
                                                value="1"
                                                className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                                            />
                                            VW
                                        </label>
                                        <label>
                                            <input
                                                required
                                                checked={vehicle === '2'}
                                                onChange={(event) => {
                                                    setVehicle(event.target.value)
                                                    updateVehicleData();
                                                }}
                                                type="radio"
                                                name="vehicle"
                                                value="2"
                                                className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                                            />
                                            Ferrari
                                        </label>
                                    </div>
                                    <span className="text-sm text-red-600 hidden"
                                          id="error">Option has to be selected</span>
                                </fieldset>

                                <div className="flex flex-row space-x-4">
                                    <div className="relative z-0 w-full mb-5">
                                        <input
                                            value={date}
                                            onChange={(event) => setDate(event.target.value)}
                                            required
                                            type="date"
                                            name="date"
                                            placeholder=" "
                                            className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                        />
                                        <label htmlFor="date"
                                               className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Datum</label>
                                        <span className="text-sm text-red-600 hidden" id="error">Date is required</span>
                                    </div>
                                    {/*<div className="relative z-0 w-full">*/}
                                    {/*    <input*/}
                                    {/*        type="time"*/}
                                    {/*        name="time"*/}
                                    {/*        placeholder=" "*/}
                                    {/*        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"*/}
                                    {/*    />*/}
                                    {/*    <label htmlFor="time"*/}
                                    {/*           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Uhrzeit</label>*/}
                                    {/*    <span className="text-sm text-red-600 hidden" id="error">Time is required</span>*/}
                                    {/*</div>*/}
                                </div>

                                <div className="relative z-0 w-full mb-5">
                                    <input
                                        value={reason}
                                        onChange={(event) => setReason(event.target.value)}
                                        type="text"
                                        name="reasonForUse"
                                        placeholder=" "
                                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    />
                                    <label htmlFor="name"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Reiseziel</label>
                                    <span className="text-sm text-red-600 hidden" id="error">Grund wird benötigt</span>
                                </div>

                                <div className="relative z-0 w-full mb-5">
                                    <input
                                        value={currentMileAge}
                                        onChange={(event) => setCurrentMileAge(event.target.value)}
                                        required
                                        type="number"
                                        name="mileageBefore"
                                        placeholder=" "
                                        className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    />
                                    <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-400">km</div>
                                    <label htmlFor="duration"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Aktueller
                                        Kilometerstand</label>
                                    <span className="text-sm text-red-600 hidden" id="error">Duration is required</span>
                                </div>

                                <div className="relative z-0 w-full mb-5">
                                    <input
                                        value={newMileAge}
                                        onChange={(event) => setNewMileAge(event.target.value)}
                                        required
                                        type="number"
                                        name="mileageAfter"
                                        placeholder=" "
                                        className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    />
                                    <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-400">km</div>
                                    <label htmlFor="duration"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Neuer
                                        Kilometerstand</label>
                                    <span className="text-sm text-red-600 hidden" id="error">Duration is required</span>
                                </div>

                                {newMileAge && newMileAge > currentMileAge &&
                                <div className="relative z-0 w-full mb-5">
                                    <p className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent">
                                        Es wurde eine Strecke von {Number(newMileAge - currentMileAge).toFixed(1)} km
                                        gefahren.</p>
                                    <p className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent">
                                        Kosten: {Number((newMileAge - currentMileAge) * 0.20).toFixed(2)}€</p>
                                </div>
                                }
                                {/*<div className="relative z-0 w-full mb-5">*/}
                                {/*    <input*/}
                                {/*        type="number"*/}
                                {/*        name="money"*/}
                                {/*        placeholder=" "*/}
                                {/*        className="pt-3 pl-10 pb-2 pl-5 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"*/}
                                {/*    />*/}
                                {/*    <div className="absolute top-0 left-0 mt-3 ml-1 text-gray-400">👪‍</div>*/}
                                {/*    <label htmlFor="money"*/}
                                {/*           className="absolute duration-300 top-3 left-10 -z-1 origin-0 text-gray-500">Anzahl Passagiere</label>*/}
                                {/*    <span className="text-sm text-red-600 hidden" id="error">Amount is required</span>*/}
                                {/*</div>*/}

                                <button
                                    id="button"
                                    type="submit"
                                    className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-pink-500 hover:bg-pink-600 hover:shadow-lg focus:outline-none"
                                >
                                    Speichern
                                </button>
                            </form>
                        </div>
                    </div>
                </Suspense>
            </Fragment>
        );
}
