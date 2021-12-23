import React, {Fragment, Suspense, useContext, useEffect, useState} from "react"
import LoaderComponent from "../weather/loader/LoaderComponent";
import ErrorComponent from "../weather/error/ErrorComponent";
import {ThemeContext} from "../../context/ThemeContext";
import FileBase64 from "./FileBase64";
import './recipe.scss';

export default function RecipeCreate() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(null);
    const {theme, colorTheme} = useContext(ThemeContext);
    const [files, setFiles] = useState([]);


    useEffect(() => {
        console.log(files)
    }, [setFiles, files]);

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
    } else {
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                    }>
                    <div
                        className={`text-${colorTheme} m-5 p-3 flex flex-col divide-gray-400 shadow-2xl rounded-lg`}
                        style={{
                            backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
                        }}
                    contentEditable={true}>
                        <h1 className='text-4xl font-bold mb-5 m-auto'>Placeholder</h1>
                        <div className='flex justify-between'>
                            <div className='grow'>
                                <h2 className='text-xl mb-5'>Desc</h2>
                                <h2 className='text-xl'>Autor: Author</h2>
                                <h2 className='text-xl'>Dauer: X min</h2>
                            </div>
                            {
                                files.length !== 0 ?
                                    files.map((file, index) => {
                                        return (
                                            <img
                                                key={index}
                                                className="max-w-xs w-1/6 h-1/6 mx-5 shadow-lg rounded-lg"
                                                src={file.base64}
                                                alt={file.name}
                                            />
                                        );
                                    })
                                    :
                                    <div className="w-44 h-40 mx-5 shadow-lg rounded-lg image-upload">
                                        <label htmlFor="file-input" className="cursor-pointer">
                                            <p className="w-full h-full flex flex-col justify-center items-center border-2 border-dashed border-gray-400 rounded-lg">
                                                Bild auswählen
                                            </p>
                                        </label>
                                        <FileBase64 multiple={true} onDone={setFiles}/>
                                    </div>
                            }
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
                        <hr className="border-2 mt-5"/>
                        <div
                            className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} border-0 shadow-lg rounded-lg m-5 cursor-pointer`}>
                            <div
                                className={`${theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-400'} grid grid-cols-2 h-10 content-center rounded-t-lg shadow-2xl`}>
                                <div className="inline-flex">
                                    <h1 className={`${theme === 'dark' ? 'bg-indigo-200' : 'bg-indigo-100'} rounded-full w-10 ml-2 text-center`}>X</h1>
                                    <h1 className="ml-2 text-left">StepName</h1>
                                </div>
                                {/* <h1 className="text-right mr-2">21 min</h1> */}
                            </div>
                            <div className="p-2">
                                <div>Description</div>
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
