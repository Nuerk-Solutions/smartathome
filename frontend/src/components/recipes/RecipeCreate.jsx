import React, {Fragment, Suspense, useContext, useEffect, useState} from "react"
import LoaderComponent from "../weather/loader/LoaderComponent";
import ErrorComponent from "../weather/error/ErrorComponent";
import {ThemeContext} from "../../context/ThemeContext";
import FileBase64 from "./FileBase64";
import './recipe.scss';
import ReactFloatingLabelInputEsm from "react-floating-label-input";
import {TiDeleteOutline} from "react-icons/all";

export default function RecipeCreate() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(null);
    const {theme, colorTheme} = useContext(ThemeContext);
    const [files, setFiles] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    // Generate UUID
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const addIngredient = () => {
        let ingredient = {
            id: uuidv4(),
            amount: '1',
            quantity: '',
            unit: '',
            name: ''
        };
        setIngredients([...ingredients, ingredient]);
    };

    const removeIngredient = (id) => {
        const newList = ingredients.filter(ingredient => ingredient.id !== id);
        setIngredients(newList);
    };

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
                        }}>
                        <div className={"m-auto text-4xl font-bold mb-5"}>
                            <ReactFloatingLabelInputEsm
                                label="Rezeptname"
                                name="name"
                            />
                        </div>
                        <div className='flex justify-between'>
                            <div className='grow'>
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    label="Kurzbeschreibung"
                                    name="description"
                                />
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    label="Autor"
                                    name="author"
                                />
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    label="Dauer in min"
                                    name="duration"
                                    type="number"
                                />
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
                                    {
                                        ingredients.length !== 0 ?
                                            <div className={"flex flex-col justify-center items-center"}>
                                                {
                                                    ingredients.map((ingredient, index) => {
                                                        return (
                                                            <div key={ingredient.id} className='m-1'>
                                                                <div className='flex flex-row'>
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        defaultValue={ingredient.amount}
                                                                        label="Anzahl"
                                                                        name="amount"
                                                                        type="number"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        defaultValue={ingredient.quantity}
                                                                        label="Menge"
                                                                        name="quantity"
                                                                        type="number"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        defaultValue={ingredient.unit}
                                                                        label="Einheit"
                                                                        name="unit"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        defaultValue={ingredient.name}
                                                                        label="Name"
                                                                        name="name"
                                                                    />
                                                                    <div
                                                                        className='flex flex-row justify-center items-center'>
                                                                        <button
                                                                            className='text-red-500 hover:text-red-700 text-white font-bold py-2 px-4 rounded text-3xl'
                                                                            onClick={() => removeIngredient(ingredient.id)}
                                                                        >
                                                                            <TiDeleteOutline />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <button
                                                    className='w-1/4 h-12 mt-5 border-2 border-dashed border-gray-400 rounded-lg'
                                                    onClick={() => addIngredient()}
                                                >
                                                    Zutaten hinzufügen
                                                </button>
                                            </div>
                                            :
                                            <button
                                                className='w-full h-full flex flex-col justify-center items-center border-2 border-dashed border-gray-400 rounded-lg'
                                                onClick={() => addIngredient()}
                                            >
                                                Zutaten hinzufügen
                                            </button>

                                    }
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
