import React, {Fragment, Suspense} from 'react';
import LoaderComponent from "../weather/loader/LoaderComponent";

export default function () {


    return (
        <Fragment>
            <Suspense
                fallback={
                    <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                }>
                <div className="bg-gray-100 p-0 sm:p-12 flex flex-row">
                    <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                        <h1 className="text-2xl font-bold mb-8">VW</h1>
                        <form id="form">
                            <div className="relative z-0 w-full mb-2 pb-5">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Getankt bei:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 127km</label>
                            </div>

                            <div className="relative z-0 w-full mb-2 pb-5">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Tankmenge:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 60L</label>
                            </div>

                            <div className="relative z-0 w-full pb-2">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Wartung bei:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 456km</label>
                                <p className={"relative duration-300 top-3 -z-1 origin-0 text-gray-500 underline"}>Art:</p>
                            </div>
                            <div className="relative w-full">
                                <label htmlFor="duration"
                                       className="relative">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et e</label>
                            </div>
                        </form>
                    </div>

                    <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                        <h1 className="text-2xl font-bold mb-8">Ferrari</h1>
                        <form id="form">
                            <div className="relative z-0 w-full mb-2 pb-5">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Getankt bei:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 127km</label>
                            </div>

                            <div className="relative z-0 w-full mb-2 pb-5">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Tankmenge:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 60L</label>
                            </div>

                            <div className="relative z-0 w-full pb-2">
                                <label htmlFor="duration"
                                       className="relative duration-300 top-3 -z-1 origin-0 text-gray-500">Wartung bei:</label><label className={"relative duration-300 top-3 -z-1 origin-0"}> 456km</label>
                                <p className={"relative duration-300 top-3 -z-1 origin-0 text-gray-500 underline"}>Art:</p>
                            </div>
                            <div className="relative w-full">
                                <label htmlFor="duration"
                                       className="relative">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea tak</label>
                            </div>
                        </form>
                    </div>
                </div>
            </Suspense>
        </Fragment>
    );

}
