import React, {useContext, useState} from 'react';
import {ThemeContext} from "../../context/ThemeContext";
import AudioControls from "./AudioControls";
import './colorBackdrop.css';
import Backgrop from "./Backgrop";

export default function ({
                             radioName,
                             radioImage,
                             title
                         }) {

    const {theme, colorTheme} = useContext(ThemeContext);
    const [isPlaying, setIsPlaying] = useState(false);

    const [volume, setVolume] = useState(50);

    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${isPlaying}, #fff), color-stop(${isPlaying}, #777))
  `;

    // const onScrubEnd = () => {
    //     // If not already playing, start
    //     if (!isPlaying) {
    //         setIsPlaying(true);
    //     }
    //     startTimer();
    // };

    return (
        <div
            className={`text-${colorTheme} relative z-0 max-h-96 max-w-md px-6 pt-5 pb-5 border-0 shadow-lg rounded-2xl mt-5 mb-5 cursor-pointer`}>

            {/*Image*/}
            <div className={"grid place-items-center"}>
                <div className="w-40 h-40 bg-gray-200 rounded-2xl shadow-lg">
                    <img src={radioImage} alt={"No Img"}/>
                </div>
            </div>

            {/*Name and Title*/}
            <div className={"grid place-items-center mt-5"}>
                <div className={"mb-2"}>{radioName}</div>
                <div>{title}</div>
            </div>

            {/*Audio Controls*/}
            <div className={"grid place-items-center"}>
                <AudioControls isPlaying={isPlaying} onPlayPauseClick={setIsPlaying}/>
                <input
                    type="range"
                    value={volume}
                    step="1"
                    min="0"
                    max={100}
                    className="progress"
                    onChange={(e) => setVolume(Number(e.target.value))}
                    // onMouseUp={onScrubEnd}
                    // onKeyUp={onScrubEnd}
                    style={{background: trackStyling}}
                />
            </div>

            {/*Backdrop*/}
            <Backgrop activeColor={'#00aeb0'} isPlaying={isPlaying}/>
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
