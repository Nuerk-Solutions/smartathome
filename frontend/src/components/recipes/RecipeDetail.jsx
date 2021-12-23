import React, {Fragment, Suspense, useContext, useEffect, useState} from "react";
import axois from "axios";
import ErrorComponent from "../weather/error/ErrorComponent";
import LoaderComponent from "../weather/loader/LoaderComponent";
import {useParams} from "react-router-dom";
import {ThemeContext} from "../../context/ThemeContext";
import './recipe.scss';

export default function RecipeDetail() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);

    const {theme, colorTheme} = useContext(ThemeContext);
    const {id} = useParams();

    useEffect(async () => {
        await axois.get("http://localhost:2000/recipe/" + id).then(
            (result) => {
                setJson(result.data);
                setIsLoaded(true);
            },
            (error) => {
                setError(error);
                setIsLoaded(true);
            }
        );
    }, [id]);

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
            <LoaderComponent loaderText={`Abrufen des Rezepts 😎`}/>
        );
    } else
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Rezepte-UI wird geladen'}/>
                    }>
                    {
                        [json].map((item, index) => {
                            return (
                                <div key={index}
                                     className={`text-${colorTheme} m-5 p-3 flex flex-col divide-gray-400 shadow-2xl rounded-lg`}
                                     style={{
                                         backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
                                     }}>
                                    <h1 className='text-4xl font-bold mb-5 m-auto'>{item.name}</h1>
                                    <div className='flex justify-between'>
                                        <div className='grow'>
                                            <h2 className='text-xl mb-5'>{item.description}</h2>
                                            <h2 className='text-xl'>Autor: {item.author}</h2>
                                            <h2 className='text-xl'>Dauer: {item.duration} min</h2>
                                        </div>
                                        <img
                                            className="max-w-xs w-1/6 h-1/6 mx-5 shadow-lg rounded-lg"
                                            src={"data:image/png;base64, " + item.image}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className='separator mt-5'>Zutaten</div>
                                    <div className={"flex flex-col justify-center text-center items-center"}>
                                        {
                                            item.ingredients.map((ingredient, index) => {
                                                return (
                                                    <div key={index} className='m-1'>
                                                        <div className='flex flex-row'>
                                                            <h2 className='text-xl mr-2'>{ingredient.amount}x</h2>
                                                            <h2 className='text-xl'>{ingredient.quantity}</h2>
                                                            <h2 className='text-xl mr-2'>{ingredient.unit}</h2>
                                                            <h2 className='text-xl'>{ingredient.name}</h2>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                    <hr className="border-2 mt-5"/>
                                    {
                                        item.steps.map((stepItem, stepIndex) => {
                                            return (
                                                <div key={stepIndex}
                                                     className={`${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} border-0 shadow-lg rounded-lg m-5 cursor-pointer`}>
                                                    <div
                                                        className={`${theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-400'} grid grid-cols-2 h-10 content-center rounded-t-lg shadow-2xl`}>
                                                        <div className="inline-flex">
                                                            <h1 className={`${theme === 'dark' ? 'bg-indigo-200' : 'bg-indigo-100'} rounded-full w-10 ml-2 text-center`}>{stepItem.step}</h1>
                                                            <h1 className="ml-2 text-left">{stepItem.name}</h1>
                                                        </div>
                                                        {/* <h1 className="text-right mr-2">21 min</h1> */}
                                                    </div>
                                                    <div className="p-2">
                                                        <div>{stepItem.description}</div>
                                                        {/* <div className="mt-5">
                                                 Hinweis: {stepItem.hint}
                                             </div> */}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </Suspense>
            </Fragment>
        )
};
