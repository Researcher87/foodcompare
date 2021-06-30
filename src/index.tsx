import React from 'react';
import {hydrate, render} from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById("root");
if (rootElement && rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
} else {
    render(<React.StrictMode>
        <App />
    </React.StrictMode>, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

<script data-ad-client="ca-pub-2335013571820161" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
