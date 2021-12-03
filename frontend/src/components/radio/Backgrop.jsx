import React, { useEffect } from "react";
import Vibrant from "node-vibrant/lib/bundle";
import './colorBackdrop.css';

const Backdrop = ({ activeColor, isPlaying }) => {
    useEffect(() => {
        activeColor && (
        Vibrant.from(activeColor).getPalette().then(palette => {
            const {vibrant, darkVibrant, lightVibrant, darkMuted, lightMuted} = palette;
            const color = vibrant ? vibrant.hex : darkVibrant ? darkVibrant.hex : lightVibrant ? lightVibrant.hex : darkMuted ? darkMuted.hex : lightMuted ? lightMuted.hex : '#fff';
            document.documentElement.style.setProperty("--active-color", color);
        })) || document.documentElement.style.setProperty("--active-color", '#0048ff');
    }, [activeColor]);

    return <div className={`px-6 pt-5 border-0 shadow-lg rounded-2xl cursor-pointer color-backdrop ${isPlaying ? "playing" : "idle"}`} />;
};

export default Backdrop;
