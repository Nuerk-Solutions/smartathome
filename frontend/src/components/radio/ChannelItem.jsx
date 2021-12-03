import React, {useContext, useEffect, useRef, useState} from 'react';
import {ThemeContext} from "../../context/ThemeContext";
import AudioControls from "./AudioControls";
import './colorBackdrop.css';
import Backdrop from "./Backdrop";

export default function ({
                             radioName,
                             radioImage,
                             title,
                             color,
                             onClick,
                             mp3
                         }) {

    const {theme, colorTheme} = useContext(ThemeContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const audio = useRef(new Audio(mp3));

    const [volume, setVolume] = useState(50);

    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${isPlaying}, #fff), color-stop(${isPlaying}, #777))
  `;

    useEffect(() => {
        audio.current = new Audio(mp3);
    }, [setIsPlaying]);


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
                background: color,
            }}
            onClick={(e) => {
                if (e.target.type === 'range') return;
                setIsPlaying(!isPlaying)
                onClick();
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
                <div>{title}</div>
            </div>

            {/*Audio Controls*/}
            <div className={"grid place-items-center"}>
                <AudioControls isPlaying={isPlaying} onPlayPauseClick={(e) => {
                    if (e) {
                        audio.current.play();
                        setIsPlaying(!isPlaying);
                    } else {
                        audio.current.pause();
                    }

                }}/>
                <input
                    type="range"
                    value={volume}
                    step="1"
                    min="0"
                    max={100}
                    className="progress"
                    onChange={(e) => {
                        setVolume(Number(e.target.value))
                        audio.current.volume = Number(e.target.value) / 100;
                    }}
                    style={{background: trackStyling}}
                />
            </div>

            {/*Backdrop*/}
            <Backdrop activeColor={color} isPlaying={isPlaying}/>
        </div>
    );
}

{/*<Ticker speed={"2"} mode={"await"}>*/
}
{/*    {({index}) => (*/
}
{/*        <>*/
}
{/*            <div>TWOCOLORS - PASSION</div>*/
}
{/*        </>*/
}
{/*    )}*/
}
{/*</Ticker>*/
}
