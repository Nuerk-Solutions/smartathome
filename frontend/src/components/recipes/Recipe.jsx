import React, {Fragment, Suspense, useEffect, useState} from "react"
import axios from "axios";
import ErrorComponent from "../weather/error/ErrorComponent";
import LoaderComponent from "../weather/loader/LoaderComponent";
import RecipeItem from "./RecipeItem";
import {Link} from "react-router-dom";

export default function Recipe() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get("https://api.nuerk-solutions.de/recipe/list").then(
            (res) => {
                setJson(res.data);
                setIsLoaded(true);
            },
            (error) => {
                setError(error);
                setIsLoaded(true);
            }
        );
    }, []);
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
            <LoaderComponent loaderText={`Abrufen der Rezepte 😎`}/>
        );
    } else {
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Rezepte-UI wird geladen'}/>
                    }>

                    <div className="flex flex-row justify-between bg-gray-400 p-3.5">
                        <div className="flex flex-row justify-center">
                            <input placeholder="Suchen..."
                                   onChange={event => setSearchQuery(event.target.value)}/>
                        </div>
                        <div className="flex flex-row justify-center">
                            <Link
                                className="text-gray-700 font-semibold text-sm border-2 border-gray-700 p-1.5 rounded-lg"
                                to={location => ({
                                    ...location,
                                    pathname: '/recipe/create',
                                    state: {
                                        from: location.pathname
                                    }
                                })}>

                                Neues Rezept erstellen
                            </Link>
                        </div>
                    </div>
                    <div className={"flex flex-row flex-wrap gap-3 mx-2.5"}>
                        {
                            json.filter(recipe => {
                                if (searchQuery === '') {
                                    return recipe;
                                } else if (recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                                    return recipe;
                                }
                            })
                                .map((item, index) => {
                                    return (
                                        <RecipeItem key={index}
                                                    recipeId={item._id}
                                                    recipeName={item.name}
                                                    recipeImage={item.image}
                                                    recipeDuration={item.duration}/>
                                    );
                                })
                        }
                    </div>
                </Suspense>
            </Fragment>
        );
    }
}
