import React from 'react';
import ReactDOM from 'react-dom';
//import 'animate.css';
import {ThemeContextProvider} from './context/ThemeContext'
import './assets/css/index.css';
import './styles/main.css'
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <ThemeContextProvider>
            <App/>
        </ThemeContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
