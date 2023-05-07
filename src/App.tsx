import './App.scss';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "./contexts/ApplicationDataContext";
import React, {useContext, useEffect} from "react";

import {LanguageContext, LanguageProvider} from "./contexts/LangContext";
import ReactTooltip from "react-tooltip";
import ReactGA from "react-ga4"
import {ANALYTICS_MESS_ID} from "./config/ApplicationKeys";

import {WebPageContainer} from "./components/WebPageContainer";
import {parseFoodCompareUri} from "./service/uri/BaseUriService";


function initializeReactGA() {
    (async () => {
        try {   // NOTE: uBlock Origin may cause a crash here
            ReactGA.initialize(ANALYTICS_MESS_ID)
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
        initializeReactGA()  // Initialize Google Analytics Tool if the app is not run in test/debug mode
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
