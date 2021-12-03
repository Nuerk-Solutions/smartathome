import React from "react";
import './colorBackdrop.css';

const Backdrop = ({activeColor, isPlaying}) => {

    const gradient = {
        background: `linear-gradient(45deg, ${activeColor || '#00aeb0'} 20%, transparent 100%) no-repeat`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    }

    return <div
        className={`px-6 pt-5 border-0 shadow-lg rounded-2xl cursor-pointer ${isPlaying ? "playing" : "idle"}`}
        style={gradient}/>;
};

export default Backdrop;
