import React, {Fragment, Suspense, useEffect, useState} from 'react';
import ChannelItem from "./ChannelItem";
import axois from "axios";
import ErrorComponent from "../weather/error/ErrorComponent";
import LoaderComponent from "../weather/loader/LoaderComponent";

export default function () {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [json, setJson] = useState([]);
    const [channelIndexPlaying, setChannelIndexPlaying] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(async () => {
        await axois.get("https://api.nuerk-solutions.de/radio/list").then(
            (result) => {
                setJson(result.data);
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
            <LoaderComponent loaderText={`Abrufen der Radiosender 😎`}/>
        );
    } else
        return (
            <Fragment>
                <Suspense
                    fallback={
                        <LoaderComponent loaderText={'Wettervorhersage-UI wird geladen'}/>
                    }>
                    <div className={"flex flex-row flex-wrap gap-3 mx-2.5"}>
                        {
                            json.map((item, index) => {
                                return (
                                    <ChannelItem
                                        key={index}
                                        radioName={item.name}
                                        radioImage={item.image}
                                        title={"TestTitleIndex-" + index}
                                        color={item.color}
                                        mp3={item.mp3}
                                        currentlyPlay={channelIndexPlaying === index && channelIndexPlaying !== -1}
                                        onClick={() => {
                                            if(channelIndexPlaying === index) {
                                                setChannelIndexPlaying(-1)
                                                return;
                                            }
                                            setChannelIndexPlaying(index);
                                        }}
                                    />
                                );
                            })
                        }
                    </div>
                </Suspense>
            </Fragment>
        );
}
