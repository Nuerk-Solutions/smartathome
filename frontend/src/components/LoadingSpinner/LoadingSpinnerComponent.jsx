import React, {useContext} from "react";
import './LoadingSpinner.css'
import {ThemeContext} from "../../context/ThemeContext";

export default () => {
    const {theme, colorTheme} = useContext(ThemeContext)
    return (
        <div className="loadingSpinner-div">
            <svg className={"animate-spin"} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle className={"loading-circle"} cx="50" cy="50" r="45"/>
            </svg>
            <h1 className={`loadingSpinner-text-${colorTheme} text-${colorTheme} pb-3`}
                style={{
                    backgroundColor: theme === 'dark' ? '#292929' : '#e8ebee',
                }}>
                <span>L</span>
                <span>a</span>
                <span>d</span>
                <span>e</span>
                <span>n</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </h1>
        </div>
    );
}
