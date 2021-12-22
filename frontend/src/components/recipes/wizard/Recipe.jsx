import React, { Fragment, Suspense, useEffect, useState } from "react"
import axios from "axios";
import ErrorComponent from "../../weather/error/ErrorComponent";
import LoaderComponent from "../../weather/loader/LoaderComponent";
import RecipeItem from "./RecipeItem";

export default function Recipe() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:2000/recipe/list").then(
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
            <LoaderComponent loaderText={`Abrufen der Rezepte 😎`} />
        );
    } else {
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Rezepte-UI wird geladen'} />
                    }>
                    <div className={"flex flex-row flex-wrap gap-3 mx-2.5"}>
                        {
                            json.map((item, index) => {
                                return (
                                    <RecipeItem key={index}
                                        recipeId={item._id}
                                        recipeName={item.name}
                                        recipeImage={item.image}
                                        recipeDuration={item.duration} />
                                );
                            })
                        }
                    </div>
                </Suspense>
            </Fragment>
        );
    }
}
