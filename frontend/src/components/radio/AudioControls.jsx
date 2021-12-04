import React, {useEffect, useRef, useState} from "react";
import {BiLoader, IoPauseOutline, IoPlayOutline} from "react-icons/all";
import './spin.css';

export default function AudioControls({
                                          isPlaying,
                                          onPlayPauseClick,
                                          mp3
                                      }) {

    const [volume, setVolume] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const audio = useRef(new Audio());

    useEffect(() => {
        if (!isPlaying) {
            audio.current.pause();
            setIsLoading(true);
        }
    }, [isPlaying]);

    return (
        <div className="audio-controls grid place-items-center">
            {isPlaying ?
                isLoading ?
                    (
                        <BiLoader className={"loading-svg"} size={50}/>
                    ) : (
                        <button
                            type="button"
                            className="pause"
                            onClick={() => {
                                onPlayPauseClick(false)
                            }}
                            aria-label="Pause"
                        >
                            <IoPauseOutline size={50}/>
                        </button>
                    ) : (
                    <button
                        type="button"
                        className="play"
                        onClick={() => {
                            onPlayPauseClick(true)
                            audio.current = new Audio(mp3);
                            audio.current.play().then(() => {
                                setIsLoading(false);
                            });
                        }}
                        aria-label="Play"
                    >
                        <IoPlayOutline size={50}/>
                    </button>
                )}
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
            />
        </div>
    );
}
