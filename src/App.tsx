import './App.scss';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "./contexts/ApplicationDataContext";
import React, {useContext, useEffect} from "react";

import {LanguageContext, LanguageProvider} from "./contexts/LangContext";
import ReactTooltip from "react-tooltip";


import {WebPageContainer} from "./components/WebPageContainer";
import {parseFoodCompareUri} from "./service/uri/BaseUriService";


function App(): JSX.Element {
    useEffect(() => {
        ReactTooltip.rebuild()
    })

    const uriData: string | null = parseFoodCompareUri()


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
