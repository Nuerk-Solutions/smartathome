import React, {useContext} from 'react';
import {ThemeContext} from "../../context/ThemeContext";

export default function () {

    const {theme, colorTheme} = useContext(ThemeContext);

    return (
        <div className={`text-${colorTheme} mx-auto max-w-md px-6 py-12 border-0 shadow-lg rounded-2xl mt-5 mb-5`} style={{
            backgroundColor: theme === 'dark' ? '#424242' : '#ffffff',
        }}>
            <p>RadioChannelItem</p>
        </div>
    );
}
