import React, { Fragment, Suspense, useContext, useState } from "react"
import LoaderComponent from "../weather/loader/LoaderComponent";
import ErrorComponent from "../weather/error/ErrorComponent";
import { ThemeContext } from "../../context/ThemeContext";
import FileBase64 from "./FileBase64";
import './recipe.scss';
import ReactFloatingLabelInputEsm from "react-floating-label-input";
import { TiDeleteOutline } from "react-icons/all";
import autosize from "autosize/dist/autosize";
import axois from "axios";

export default function RecipeCreate() {

    const [json, setJson] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [error, setError] = useState(null);
    const { theme, colorTheme } = useContext(ThemeContext);

    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [recipeAuthor, setRecipeAuthor] = useState('');
    const [recipeDuration, setRecipeDuration] = useState('');
    const [files, setFiles] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    // Generate UUID
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const handleSubmit = (data) => {
        axois.post("http://localhost:2000/recipe", data).then(res => {
            console.log(res);
        })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    }

    const addStep = () => {
        setSteps([...steps, {
            id: uuidv4(),
            step: steps.length + 1,
            name: '',
            description: ''
        }]);
    };

    const updateStepOrder = (newSteps) => {
        let stepOrder = 1;
        setSteps(newSteps.map(step => {
            step.step = stepOrder;
            stepOrder++;
            return step;
        }));
    };

    const removeStep = (id) => {
        let newSteps = steps.filter(step => step.id !== id)
        setSteps(newSteps);
        updateStepOrder(newSteps);
    };


    const setStepName = (id, name) => {
        setSteps(steps.map(step => {
            if (step.id === id) {
                step.name = name;
            }
            return step;
        }));
    };

    const setStepDescription = (id, description) => {
        setSteps(steps.map(step => {
            if (step.id === id) {
                step.description = description;
            }
            return step;
        }));
    };


    // Ingredient management
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

    const setIngredientName = (id, name) => {
        const newList = ingredients.map(ingredient => {
            if (ingredient.id === id) {
                ingredient.name = name;
            }
            return ingredient;
        });
        setIngredients(newList);
    };

    const setIngredientUnit = (id, unit) => {
        const newList = ingredients.map(ingredient => {
            if (ingredient.id === id) {
                ingredient.unit = unit;
            }
            return ingredient;
        });
        setIngredients(newList);
    };

    const setIngredientQuantity = (id, quantity) => {
        const newList = ingredients.map(ingredient => {
            if (ingredient.id === id) {
                ingredient.quantity = quantity;
            }
            return ingredient;
        });
        setIngredients(newList);
    };

    const setIngredientAmount = (id, value) => {
        const newList = ingredients.map(ingredient => {
            if (ingredient.id === id) {
                ingredient.amount = value;
            }
            return ingredient;
        });
        setIngredients(newList);
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
                        <div className={"m-auto text-4xl font-bold mb-5"}>
                            <ReactFloatingLabelInputEsm
                                value={recipeName}
                                onChange={(e) => {
                                    setRecipeName(e.target.value)
                                }}
                                label="Rezeptname"
                                name="name"
                            />
                        </div>
                        <div className='flex justify-between'>
                            <div className='grow'>
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    value={recipeDescription}
                                    onChange={(e) => {
                                        setRecipeDescription(e.target.value)
                                    }}
                                    label="Kurzbeschreibung"
                                    name="description"
                                />
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    value={recipeAuthor}
                                    onChange={(e) => {
                                        setRecipeAuthor(e.target.value)
                                    }}
                                    label="Autor"
                                    name="author"
                                />
                                <ReactFloatingLabelInputEsm
                                    className={"mb-5"}
                                    value={recipeDuration}
                                    onChange={(e) => {
                                        setRecipeDuration(e.target.value)
                                    }}
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
                                        <FileBase64 multiple={true} onDone={setFiles} />
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
                                                                        value={ingredient.amount}
                                                                        onChange={(e) => {
                                                                            setIngredientAmount(ingredient.id, e.target.value);
                                                                        }}
                                                                        label="Anzahl"
                                                                        name="amount"
                                                                        type="number"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        value={ingredient.quantity}
                                                                        onChange={(e) => {
                                                                            setIngredientQuantity(ingredient.id, e.target.value);
                                                                        }}
                                                                        label="Menge"
                                                                        name="quantity"
                                                                        type="number"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        value={ingredient.unit}
                                                                        onChange={(e) => {
                                                                            setIngredientUnit(ingredient.id, e.target.value);
                                                                        }}
                                                                        label="Einheit"
                                                                        name="unit"
                                                                    />
                                                                    <ReactFloatingLabelInputEsm
                                                                        className={"w-11/12"}
                                                                        value={ingredient.name}
                                                                        onChange={(e) => {
                                                                            setIngredientName(ingredient.id, e.target.value);
                                                                        }}
                                                                        label="Name"
                                                                        name="name"
                                                                    />
                                                                    <div
                                                                        className='flex flex-row justify-center items-center'>
                                                                        <button
                                                                            className='text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded text-3xl'
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
                        <hr className="border-2 mt-5" />
                        {
                            steps.length !== 0 ?
                                <div>
                                    {
                                        steps.map((step, index) => {
                                            return (
                                                <div key={step.id}
                                                    className={`bg-gray-300 border-0 shadow-lg rounded-lg m-5 cursor-pointer`}>
                                                    <div
                                                        className={`bg-gray-400 grid grid-cols-2 h-10 content-center rounded-t-lg shadow-2xl`}>
                                                        <div className="inline-flex gap-3 items-center justify-center">
                                                            <h1 className={`bg-gray-100 rounded-full w-10 ml-2 text-center`}>{step.step}</h1>
                                                            <div className="relative z-0 w-full mb-2">
                                                                <input
                                                                    required
                                                                    value={step.name}
                                                                    onChange={(e) =>
                                                                        setStepName(step.id, e.target.value)}
                                                                    type="text"
                                                                    name="stepName"
                                                                    placeholder=" "
                                                                    className="pt-3 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                                />
                                                                <label htmlFor="stepName"
                                                                    className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Name</label>
                                                            </div>
                                                                <button
                                                                    className='text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded text-3xl'
                                                                    onClick={() => {
                                                                        removeStep(step.id)
                                                                    }
                                                                }
                                                                >
                                                                    <TiDeleteOutline />
                                                                </button>
                                                        </div>
                                                        {/* <h1 className="text-right mr-2">21 min</h1> */}
                                                    </div>
                                                    <div className="p-2">
                                                        <div className="relative z-0 w-full mb-5">
                                                            <textarea
                                                                required
                                                                value={step.description}
                                                                id={"stepDescription" + index}
                                                                placeholder=" "
                                                                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                                                                onChange={(event) => setStepDescription(step.id, event.target.value)}
                                                            />
                                                            <label htmlFor={"stepDescription" + index}
                                                                className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Beschreibung</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    <button
                                        className='w-full h-full flex flex-col justify-center items-center border-2 border-dashed border-gray-400 rounded-lg'
                                        onClick={() => addStep()}
                                    >
                                        Schritt hinzufügen
                                    </button>
                                </div>
                                :
                                <button
                                    className='w-full h-full mt-2 flex flex-col justify-center items-center border-2 border-dashed border-gray-400 rounded-lg'
                                    onClick={() => addStep()}
                                >
                                    Schritt hinzufügen
                                </button>
                        }
                        <button className={"bg-green-0 mt-5 rounded-lg py-2"} onClick={() => {
                            let recipe = {
                                name: recipeName,
                                description: recipeDescription,
                                author: recipeAuthor,
                                duration: recipeDuration,
                                ingredients: ingredients,
                                steps: steps,
                                image: files[0].base64,
                            }
                            handleSubmit(recipe);
                            console.log(recipe);
                        }}>Speichern
                        </button>
                    </div>
                </Suspense>
            </Fragment>
        );
    }
}
