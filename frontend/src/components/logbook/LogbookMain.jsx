import React from "react";
import {Link, Route, useRouteMatch} from "react-router-dom";


export default function () {
    const {url, path} = useRouteMatch();

    return (
        <div className="bg-gray-100 p-12 flex flex-col flex-wrap items-center gap-10">

            <Link to={`${url}/new`}
                  className="w-full flex justify-center mb-8 items-center px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl transition-all duration-150 ease-linear hover:shadow-2xl">
                <h1 className="m-auto text-2xl font-bold">Neuer Eintrag</h1>
            </Link>

            <Link to={`${url}/overview`}
                  className="w-full flex justify-center mb-8 items-center px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl transition-all duration-150 ease-linear hover:shadow-2xl">
                <h1 className="m-auto text-2xl font-bold">Fahrtenbuch</h1>
            </Link>

            <Link to={`${url}/information`}
                  className="w-full flex justify-center items-center mb-8 px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl transition-all duration-150 ease-linear hover:shadow-2xl">
                <h1 className="m-auto text-2xl font-bold">Informationen</h1>
            </Link>
        </div>
    )

}
