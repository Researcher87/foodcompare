import './App.scss';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider from "./contexts/ApplicationDataContext";
import React, {useEffect} from "react";

import {LanguageProvider} from "./contexts/LangContext";
import ReactTooltip from "react-tooltip";

import {WebPageContainer} from "./components/WebPageContainer";
import MobileDeviceCheck from "./components/MobileDeviceCheck";


function App(): JSX.Element {
    useEffect(() => {
        ReactTooltip.rebuild()
    })

    return (
        <div id="root" className="App debug">
            <NotificationContainer/>
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
