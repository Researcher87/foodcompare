import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider from "./contexts/ApplicationDataContext";
import React, {useEffect} from "react";

import {LanguageProvider} from "./contexts/LangContext";
import ReactTooltip from "react-tooltip";
import GA4React from "ga-4-react";
import {ANALYTICS_MESS_ID} from "./config/ApplicationKeys";


import MobileDeviceCheck from "./components/MobileDeviceCheck";
import {WebPageContainer} from "./components/WebPageContainer";


const ga4react = new GA4React(ANALYTICS_MESS_ID);

function initializeGA4() {
    (async () => {
        try {   // NOTE: uBlock Origin may cause a crash here
            await ga4react.initialize();
        } catch (e) {
            console.log("GA4 React initialization error ", e)
        }
    })();
}

function App(): JSX.Element {
    useEffect(() => {
        ReactTooltip.rebuild()
    })

    initializeGA4()

    return (
        <div className="App">
            <NotificationContainer/>
            <ReactTooltip/>
            <LanguageProvider>
                <ApplicationDataContextProvider>
                    <MobileDeviceCheck/>
                    <WebPageContainer/>
                </ApplicationDataContextProvider>
            </LanguageProvider>
        </div>
    );

}



export default App;
