import React from 'react';

import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";

import App from './App';

import "./styles/styles.css"
import './styles/button-17.css'
import './styles/slider.css'
import './styles/lotto.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);
