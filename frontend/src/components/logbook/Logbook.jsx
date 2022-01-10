import React, {Fragment, Suspense, useEffect, useMemo, useState} from 'react';
import axios from 'axios';

import moment from "moment-timezone";
import {useLocation} from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LoaderComponent from "../weather/loader/LoaderComponent";
import autosize from "autosize/dist/autosize";
import ErrorComponent from "../weather/error/ErrorComponent";
import {TiDelete} from "react-icons/all";

export default function () {

    const production = true && "https://api.nuerk-solutions.de" || 'http://localhost:2000';

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [driver, setDriver] = useState('');
    const [vehicle, setVehicle] = useState('2');
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [reason, setReason] = useState('Stadtfahrt');
    const [currentMileAge, setCurrentMileAge] = useState('');
    const [newMileAge, setNewMileAge] = useState('');
    const [vehicleData, setVehicleData] = useState([]);
    const [additionalInformation, setAdditionInformation] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [cost, setCost] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const sweetAlert = withReactContent(Swal);
    const params = new URLSearchParams(useLocation().search);

    const fetchData = async () => {
        axios.get(production + "/logbook").then(res => {
            if (res.data) {
                setVehicleData(res.data);
                if (res.data[1])
                    setCurrentMileAge(res.data[1].vehicle.newMileAge || '');
                setIsLoaded(true);
            }
        }).catch(error => {
            setError(error);
            setIsLoaded(true);
        });
    };

    useEffect(() => {
        if (params.get("key") !== 'ADDC5742944D56A26E8C7CD2EB1F5') {
            setError({message: 'Kein Zugriff auf diese Seite'});
            setIsLoaded(false);
        }
    }, [error, isLoaded]);

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

    // convert Additional Information Index starting by 1 to Getankt, Gewartet, default ''
    const convertAdditionalInformation = (index) => {
        switch (+index) {
            case 1:
                return 'Getankt';
            case 2:
                return 'Gewartet';
            default:
                return '';
        }
    }

    // get value of fuel amount or serviceDescription based on additional information index
    const getFuelAmountOrServiceDescription = (index) => {
        switch (+index) {
            case 1:
                return fuelAmount;
            case 2:
                return serviceDescription;
            default:
                return '';
        }
    }

    const handleDownload = async () => {
        await axios.get(production + '/logbook?dl=1', {responseType: 'blob'}).then(res => {
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


    // post request to http:localhost:2000/api/logbook new logbook entry as json
    // if error, display error message
    // use axois
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate form input newMileAge < currentMileAge if not valid, display error message; use sweetAlert
        if (!reason) {
            const emptyReason = await sweetAlert.fire({
                title: 'Achtung!',
                text: 'Es wurde kein Grund für die Fahrt angegeben. Möchtest du trotzdem fortfahren?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein',
            }).then((result) => {
                return !result.isConfirmed;
            });
            if (emptyReason)
                return;
        }

        const data = {
            driver: convertDriver(driver),
            vehicle: {
                typ: convertVehicle(vehicle),
                currentMileAge,
                newMileAge
            },
            date,
            driveReason: reason
        }

        await axios.post(production + '/logbook', additionalInformation && {
            ...data,
            additionalInformation: {
                informationTyp: convertAdditionalInformation(additionalInformation),
                information: getFuelAmountOrServiceDescription(additionalInformation),
                cost: cost
            }
        } || data)
            .then(response => {
                if (response.status === 201) {
                    sweetAlert.fire({
                        title: <p>Neue Fahrt hinzugefügt</p>,
                        icon: 'success',
                        footer: 'Fenster schließt in 5 Sekunden',
                        timerProgressBar: true,
                        timer: 5000,
                    }).then(async () => {
                        setIsLoaded(false);
                        await fetchData();
                        setDriver('');
                        setVehicle('2');
                        setDate(moment().format('YYYY-MM-DD'));
                        setReason('Stadtfahrt');
                        setCurrentMileAge('');
                        setNewMileAge('');
                        setAdditionInformation('');
                    });
                }
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    };

    // const handleDelete, handles delete request to https://api.nuerk-solutions.de/api/logbook/last, asks for confirmation, uses sweetAlert and axois
    const handleDelete = async () => {
        const deleteConfirmation = await sweetAlert.fire({
            title: 'Eintrag löschen',
            text: 'Möchtest du den letzten Eintrag wirklich löschen?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja',
            cancelButtonText: 'Nein',
        }).then((result) => {
            return result.isConfirmed;
        });
        if (deleteConfirmation) {
            await axios.delete(production + '/logbook/last')
                .then(response => {
                    if (response.status === 200) {
                        sweetAlert.fire({
                            title: <p>Letzte Fahrt gelöscht</p>,
                            icon: 'success',
                            footer: 'Fenster schließt in 5 Sekunden',
                            timerProgressBar: true,
                            timer: 5000,
                        }).then(async () => {
                            setIsLoaded(false);
                            await fetchData();
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    setError(error);
                });
        }
    };

    autosize(document.querySelectorAll('textarea'));

    if (error) {
        return (
            <div className='flex justify-center'>
                <div className='w-5/6'>
                    <ErrorComponent
                        errorMessage={error.message}
                        showCloseBtn={true}
                        closeError={() => {
                            setError(null);
                        }}
                    />
                </div>
            </div>
        );
    } else if (!isLoaded) {
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
                    <div className="p-0 sm:p-12">
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
                                        <option value="" disabled hidden/>
                                        <option value="1">Andrea</option>
                                        <option value="2">Claudia</option>
                                        <option value="3">Oliver</option>
                                        <option value="4">Thomas</option>
                                    </select>
                                    <label htmlFor="driver"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Fahrer
                                        auswählen</label>
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
                                    </div>
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
                                </div>

                                <div className="relative z-0 w-full mb-5">
                                    <input
                                        required
                                        value={reason}
                                        onChange={(event) => setReason(event.target.value)}
                                        type="text"
                                        name="reasonForUse"
                                        placeholder=" "
                                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    />
                                    {
                                        reason && <button type={"button"}
                                                          className="absolute top-0 right-0 mt-2.5 mr-4 text-gray-400 transition-all duration-150 ease-linear"
                                                          onClick={() => setReason('')}>
                                            <TiDelete size={30}/></button>
                                    }
                                    <label htmlFor="reasonForUse"
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
                                    <label htmlFor="mileageBefore"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Aktueller
                                        Kilometerstand</label>
                                    <span className="text-sm text-red-600 hidden" id="error">Duration is required</span>
                                </div>

                                <div className="relative z-0 w-full mb-6">
                                    <input
                                        min={currentMileAge}
                                        value={newMileAge}
                                        onChange={(event) => setNewMileAge(event.target.value)}
                                        required
                                        type="number"
                                        name="mileageAfter"
                                        id="mileageAfter"
                                        placeholder=" "
                                        className={`${(newMileAge && newMileAge < currentMileAge) ? 'text-red-700 border-red-200 focus:border-red-200' : ''} pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                                    />
                                    <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-400">km</div>
                                    <label htmlFor="mileageAfter"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Neuer
                                        Kilometerstand</label>
                                    <span className="text-sm text-red-600 hidden" id="error">Duration is required</span>
                                </div>

                                {newMileAge && newMileAge > currentMileAge &&
                                    <div className="relative z-0 w-full mb-5">
                                        <p className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent">
                                            Es wurde eine Strecke
                                            von {Number(newMileAge - currentMileAge).toFixed(1)} km
                                            gefahren.</p>
                                        <p className="pt-3 pb-2 pr-12 block w-full px-0 mt-0 bg-transparent">
                                            Kosten: {Number((newMileAge - currentMileAge) * 0.20).toFixed(2)}€</p>
                                    </div>
                                }

                                <hr className={"border-none h-1 bg-pink-500 rounded-lg"}/>
                                <div className="relative z-0 w-full mb-5 mt-5">
                                    <select
                                        required
                                        id={'additionalInformationId'}
                                        name="additionalInformation"
                                        value={additionalInformation}
                                        onChange={(event) => setAdditionInformation(Number(event.target.value))}
                                        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none z-1 focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                    >
                                        <option value="" disabled hidden/>
                                        <option value="1">Fahrzeug getankt</option>
                                        <option value="2">Fahrzeug gewartet</option>
                                    </select>
                                    <label htmlFor="additionalInformation"
                                           className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Zusätzliche
                                        Information</label>
                                </div>

                                {additionalInformation === 1 ?
                                    <div>
                                        <div className="relative z-0 w-full mb-5">
                                            <input
                                                min={1}
                                                required
                                                type="number"
                                                name="fuelAmount"
                                                pattern="[0-9]+([\.,][0-9]+)?"
                                                step="0.1"
                                                placeholder=" "
                                                className="pt-3 pl-10 pb-2 pl-5 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                onChange={(event) => setFuelAmount(event.target.value)}
                                            />
                                            <div className="absolute top-0 left-0 mt-3 ml-1 text-gray-400">⛽</div>
                                            <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-400">L</div>
                                            <label htmlFor="fuelAmount"
                                                   className="absolute duration-300 top-3 left-10 -z-1 origin-0 text-gray-500">Menge</label>
                                            <span className="text-sm text-red-600 hidden"
                                                  id="error">Amount is required</span>
                                        </div>
                                        <div className="relative z-0 w-full mb-5">
                                            <input
                                                type="number"
                                                min={1}
                                                name="money"
                                                pattern="[0-9]+([\.,][0-9]+)?"
                                                step="0.01"
                                                placeholder=" "
                                                className="pt-3 pb-2 pl-5 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                onChange={(event) => setCost(event.target.value)}
                                            />
                                            <div className="absolute top-0 left-0 mt-3 ml-1 text-gray-400">€</div>
                                            <label htmlFor="money"
                                                   className="absolute duration-300 top-3 left-7 -z-1 origin-0 text-gray-500">Preis</label>
                                            <span className="text-sm text-red-600 hidden"
                                                  id="error">Preis is required</span>
                                        </div>
                                    </div>
                                    : additionalInformation === 2 ?
                                        // vehicle service with small description about 500 characters
                                        <div>
                                            <div className="relative z-0 w-full mb-5">
                                            <textarea
                                                required
                                                id={"serviceDescription"}
                                                placeholder=" "
                                                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                onChange={(event) => setServiceDescription(event.target.value)}
                                            />
                                                <label htmlFor="serviceDescription"
                                                       className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Beschreibung</label>
                                            </div>
                                            <div className="relative z-0 w-full mb-5">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    name="money"
                                                    pattern="[0-9]+([\.,][0-9]+)?"
                                                    step="0.01"
                                                    placeholder=" "
                                                    className="pt-3 pb-2 pl-5 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                    onChange={(event) => setCost(event.target.value)}
                                                />
                                                <div className="absolute top-0 left-0 mt-3 ml-1 text-gray-400">€</div>
                                                <label htmlFor="money"
                                                       className="absolute duration-300 top-3 left-7 -z-1 origin-0 text-gray-500">Preis</label>
                                                <span className="text-sm text-red-600 hidden"
                                                      id="error">Preis is required</span>
                                            </div>
                                        </div>
                                        : null
                                }
                                <button
                                    disabled
                                    onClick={() => document.getElementById('additionalInformationId').required = false}
                                    id="button"
                                    type="submit"
                                    className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-green-500 hover:bg-green-600 hover:shadow-lg focus:outline-none"
                                >
                                    Speichern
                                </button>
                            </form>
                            <button
                                disabled
                                id="button"
                                className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-red-400-accent hover:bg-red-700-accent hover:shadow-lg focus:outline-none"
                                onClick={handleDelete}
                            >
                                Letzten Eintrag Löschen
                            </button>
                            <button
                                id="button"
                                className="w-full px-6 py-3 mt-10 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-pink-500 hover:bg-pink-600 hover:shadow-lg focus:outline-none"
                                onClick={handleDownload}
                            >
                                Download XLSX
                            </button>
                        </div>
                    </div>
                </Suspense>
            </Fragment>
        );
}
