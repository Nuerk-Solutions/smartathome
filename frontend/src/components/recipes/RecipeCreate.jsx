import React, {Fragment, Suspense, useContext, useEffect, useState} from "react"
import axios from "axios";
import LoaderComponent from "../weather/loader/LoaderComponent";
import ErrorComponent from "../weather/error/ErrorComponent";
import {ThemeContext} from "../../context/ThemeContext";

export default function RecipeCreate() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(null);
    const {theme, colorTheme} = useContext(ThemeContext);

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
            <LoaderComponent loaderText={`Abrufen der neusten Daten 😎`} />
        );
    } else {
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'} />
                    }>
                    <div
                        className={`text-${colorTheme} m-5 p-3 flex flex-col divide-gray-400 shadow-2xl rounded-lg`}
                        style={{
                            backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
                        }}>
                        <h1 className='text-4xl font-bold mb-5 m-auto'>Placeholder</h1>
                        <div className='flex justify-between'>
                            <div className='grow'>
                                <h2 className='text-xl mb-5' contentEditable={true}>Desc</h2>
                                <h2 className='text-xl'>Autor: Author</h2>
                                <h2 className='text-xl'>Dauer: X min</h2>
                            </div>
                            <div className="w-44 h-40 mx-5 shadow-lg rounded-lg border-2">
                                <img className='w-full h-full' src='https://via.placeholder.com/300x300' alt='Placeholder'/>
                            </div>
                        </div>
                        <div className='separator mt-5'>Zutaten</div>
                        <div className={"flex flex-col justify-center text-center items-center"}>
                            <div className='m-1'>
                                <div className='flex flex-row'>
                                    <h2 className='text-xl mr-2'>Xx</h2>
                                    <h2 className='text-xl'>Quantity</h2>
                                    <h2 className='text-xl mr-2'>Unit</h2>
                                    <h2 className='text-xl'>Name</h2>
                                </div>
                            </div>
                        </div>
                        <hr className="border-2 mt-5" />
                        <div className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} border-0 shadow-lg rounded-lg m-5 cursor-pointer`}>
                            <div
                                className={`${theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-400'} grid grid-cols-2 h-10 content-center rounded-t-lg shadow-2xl`}>
                                <div className="inline-flex">
                                    <h1 className={`${theme === 'dark' ? 'bg-indigo-200' : 'bg-indigo-100'} rounded-full w-10 ml-2 text-center`}>X</h1>
                                    <h1 className="ml-2 text-left">StepName</h1>
                                </div>
                                {/* <h1 className="text-right mr-2">21 min</h1> */}
                            </div>
                            <div className="p-2">
                                <div contentEditable={true}>Description</div>
                                {/* <div className="mt-5">
                                        Hinweis: {stepItem.hint}
                                    </div> */}
                            </div>
                        </div>
                    </div>
                </Suspense>
            </Fragment>
        );
    }
}
