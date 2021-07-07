import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider from "./contexts/ApplicationDataContext";
import FoodDataPanelContainer from "./components/fooddatapanel/FoodDataPanelContainer";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import {
    PATH_FOODDATA_PANEL,
    PATH_HOME,
    PATH_CONTACT,
    PATH_RANKING,
    PATH_USERSETTINGS,
    PATH_MOBILE_APP
} from "./config/Constants";
import {LanguageProvider} from "./contexts/LangContext";
import {UserSettings} from "./components/UserSettings";
import {Contact} from "./components/Contact";
import ReactTooltip from "react-tooltip";
import GA4React, {useGA4React} from "ga-4-react";
import {ANALYTICS_MESS_ID} from "./config/GoogleTools";
import {render} from "react-dom";
import {Home} from "./components/Home";
import {FoodCompareApp} from "./components/FoodCompareApp";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Switch from "react-bootstrap/Switch";


const ga4react = new GA4React(ANALYTICS_MESS_ID);

function App(): JSX.Element {
    const ga = useGA4React();

    useEffect(() => {
        ReactTooltip.rebuild()
    })

    return (
        <div className="App">
            <NotificationContainer/>
            <ReactTooltip/>
            <LanguageProvider>
                <ApplicationDataContextProvider>
                    <Router>
                        <Header/>
                        <Switch>
                            <Route path={"/foodcompare"} component={Home}/>
                            <Route path={PATH_HOME} component={Home}/>
                            <Route path={PATH_FOODDATA_PANEL} component={FoodDataPanelContainer}/>
                            <Route path={PATH_MOBILE_APP} component={FoodCompareApp}/>
                            <Route path={PATH_USERSETTINGS} component={UserSettings}/>
                            <Route path={PATH_CONTACT} component={Contact}/>
                            <Route exact path={"/"} component={Home}/>
                        </Switch>
                    </Router>
                </ApplicationDataContextProvider>
            </LanguageProvider>
        </div>
    );

}

(async () => {
    try {   // NOTE: uBlock Origin may cause a crash here
        await ga4react.initialize();
    } catch (e) {
        console.error(e)
    }

    render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
        document.getElementById("root")
    );
})();

export default App;
