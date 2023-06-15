import React from 'react';
import {hydrate, render} from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById("root");

/* if (rootElement && rootElement.hasChildNodes()) {
    hydrate(<div><App/></div>, rootElement);
} else {
    render(
        <div><App/></div>, rootElement);
} */

render(<div><App/></div>, rootElement);


// reportWebVitals();


