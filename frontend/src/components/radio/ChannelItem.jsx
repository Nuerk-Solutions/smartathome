import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from "../../context/ThemeContext";
import AudioControls from "./AudioControls";
import './colorBackdrop.css';
import Backdrop from "./Backdrop";
import axois from "axios";
import Ticker from "react-ticker";

export default function ({
                             id,
                             radioName,
                             radioImage,
                             color,
                             mp3,
                             currentlyPlay,
                             onClick
                         }) {

    const {theme, colorTheme} = useContext(ThemeContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [seconds, setSeconds] = useState(-1);
    const [publicTitle, publicTitleSet] = useState('Loading...');
    let refreshDelay = 31 * 10; //30 seconds


    const GetTitleFromAPI = () => {
        const [title, setTitle] = useState('Loading...');

        async function fetchData() {
            await axois.get("https://api.nuerk-solutions.de/radio/currentSong/" + id).then(res => {
                setTitle(res.data);
                publicTitleSet(res.data);
            });
        }


        useEffect(async () => {
            await fetchData();
        }, []);

        useEffect(async () => {
            const timer = seconds <= refreshDelay && setInterval(() => setSeconds(seconds + 1), 100); // 1000ms = 1sec
            if (seconds > refreshDelay) {
                setSeconds(0);
                await fetchData();
            }
            return () => clearInterval(timer);
        }, [seconds]);

        return <div>{title}</div>
    }


    const getContrastYIQ = (hexcolor) => {
        const r = parseInt(hexcolor.substr(1, 2), 16);
        const g = parseInt(hexcolor.substr(3, 2), 16);
        const b = parseInt(hexcolor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'dark' : 'light';
    };

    return (
        <div
            className={`text-${getContrastYIQ(color)} relative z-0 max-h-96 w-full md:max-w-sm px-6 pt-5 pb-5 border-0 shadow-lg rounded-2xl mt-5 mb-5 cursor-pointer`}
            style={{
                background: (isPlaying ? color : `linear-gradient(180deg, ${color}, #000000)`),
            }}
            onClick={(e) => {
                if (e.target.type === 'range') return;
                setIsPlaying(!isPlaying);
                onClick(e);
            }}>

            {/*Image*/}
            <div className={"grid place-items-center"}>
                <div className="w-40 h-40 bg-gray-200 rounded-2xl shadow-lg">
                    <img className={"rounded-2xl shadow-lg"} id={`img-${radioImage}`} src={radioImage} alt={"No Img"}/>
                </div>
            </div>

            {/*Name and Title*/}
            <div className={"grid place-items-center mt-5"}>
                <div className={"mb-2"}>{radioName}</div>
            </div>
            <div className={"whitespace-nowrap"}>
                <Ticker speed={2} mode={"await"}>
                    {() => <GetTitleFromAPI/>}
                </Ticker>
            </div>

            {/*Audio Controls*/}
            <AudioControls isPlaying={currentlyPlay} onPlayPauseClick={setIsPlaying} radioName={radioName}
                           radioImage={radioImage} title={publicTitle} mp3={mp3}/>

            {/*Backdrop*/}
            <Backdrop activeColor={color} isPlaying={currentlyPlay}/>
        </div>
    );
}
