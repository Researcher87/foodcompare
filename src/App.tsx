import './App.scss';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "./contexts/ApplicationDataContext";
import React, {useContext, useEffect} from "react";

import {LanguageContext, LanguageProvider} from "./contexts/LangContext";
import ReactTooltip from "react-tooltip";
import GA4React from "ga-4-react";
import {ANALYTICS_MESS_ID} from "./config/ApplicationKeys";


import {WebPageContainer} from "./components/WebPageContainer";
import {parseFoodCompareUri} from "./service/uri/BaseUriService";


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

    const uriData: string | null = parseFoodCompareUri()
    if(uriData !== "test" && uriData !== "debug") {
        initializeGA4()  // Initialize Google Analytics Tool if the app is not run in test/debug mode
    }


    return (
        <div className="App">
            <NotificationContainer/>
            <ReactTooltip/>
            <LanguageProvider>
                <ApplicationDataContextProvider>
                    <WebPageContainer/>
                </ApplicationDataContextProvider>
            </LanguageProvider>
        </div>
    );

}



export default App;
