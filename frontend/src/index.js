import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import {ThemeContextProvider} from './context/ThemeContext'
import './styles/styles.css'
import App from './App';

ReactDOM.render(
  <React.StrictMode>
      <ThemeContextProvider>
          <App />
      </ThemeContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
