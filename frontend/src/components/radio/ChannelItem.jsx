import React, {useContext} from 'react';
import {ThemeContext} from "../../context/ThemeContext";

export default function (props) {

    const {theme, colorTheme} = useContext(ThemeContext);

    return (
        <div className={`text-${colorTheme} w-full max-w-md max-h-96 px-6 pt-5 border-0 shadow-lg rounded-2xl mt-5 mb-5 cursor-pointer`} style={{
            backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
        }}>
            <div className={`radio-item`}>
                <div className={`radio-item-container`}>
                    <div className="radio-item-image w-40 h-40 bg-gray-200 rounded-2xl shadow-lg">
                        <img src={props.image} />
                    </div>
                    <div className="radio-item-info">
                        <div className="radio-item-name">{props.name}</div>
                        <div className="radio-item-current-song">{"Current Song"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
