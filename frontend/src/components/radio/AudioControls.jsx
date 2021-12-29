import React, {useEffect, useRef, useState} from "react";
import {BiLoader, IoPauseOutline, IoPlayOutline} from "react-icons/all";
import './spin.css';
import './inputRangeSlieder.css';

export default function AudioControls({
                                          isPlaying,
                                          onPlayPauseClick,
                                          mp3,
                                          radioName,
                                          radioImage,
                                          title,
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
                            audio.current.volume = volume / 100;
                            audio.current.play().then(() => {
                                navigator.mediaSession.metadata = new MediaMetadata({
                                    title: title,
                                    artist: radioName,
                                    artwork: [
                                        {src: radioImage, sizes: '512x512', type: 'image/png'},
                                    ],
                                });
                                // mediaSession.setActionHandler('play', () => {
                                //     setIsPlaying(true);
                                //     onClick();
                                // });
                                // mediaSession.setActionHandler('pause', () => {
                                //     setIsPlaying(false);
                                //     onClick();
                                // });
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
                className="mt-5 invisible md:visible"
                onChange={(e) => {
                    setVolume(Number(e.target.value))
                    audio.current.volume = Number(e.target.value) / 100;
                }}
            />
        </div>
    );
}
