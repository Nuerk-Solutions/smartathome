import React, {useEffect} from "react";
import './colorBackdrop.css';

const Backdrop = ({activeColor, isPlaying}) => {
    useEffect(() => {
        document.documentElement.style.setProperty("--active-color", activeColor);
    }, [activeColor]);

    return <div
        className={`px-6 pt-5 border-0 shadow-lg rounded-2xl cursor-pointer color-backdrop ${isPlaying ? "playing" : "idle"}`}/>;
};

export default Backdrop;
