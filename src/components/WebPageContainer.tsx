import Header from "./Header";
import Switch from "react-bootstrap/Switch";
import {
    PATH_CONTACT,
    PATH_DIRECT_COMPARE,
    PATH_FOODCOMPARE,
    PATH_FOODDATA_PANEL,
    PATH_HOME,
    PATH_RANKING,
    PATH_USERSETTINGS
} from "../config/Constants";
import {Home} from "./Home";
import FoodDataPanelContainer from "./fooddatapanel/FoodDataPanelContainer";
import DirectCompareContainer from "./directcompare/DirectCompareContainer";
import {UserSettings} from "./UserSettings";
import {ContactContainer} from "./contact/ContactContainer";
import React, {useContext, useState} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {RankingContainer} from "./ranking/RankingContainer";
import {Chart} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import {isMobileDevice} from "../service/WindowDimension";
import {applicationStrings} from "../static/labels";

import {NotificationManager} from 'react-notifications'
import {LanguageContext} from "../contexts/LangContext";

export function WebPageContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const [mobileWarningWasShown, setMobileWarningWasShown]  = useState(false)

    if (!applicationContext) {
        return <div/>
    }

    // Registering requires some time and should only be performed when the real site is loaded.
    Chart.register(annotationPlugin)

    if(isMobileDevice() && !mobileWarningWasShown) {
        NotificationManager.info(applicationStrings.message_mobile_app[language])
        setMobileWarningWasShown(true)
    }

    return (
        <div>
            <div>
                <Router>
                    <Header/>
                    <Switch>
                        <Route path={PATH_FOODCOMPARE} component={Home}/>
                        <Route path={PATH_HOME} component={Home}/>
                        <Route path={PATH_FOODDATA_PANEL} component={FoodDataPanelContainer}/>
                        <Route path={PATH_DIRECT_COMPARE} component={DirectCompareContainer}/>
                        <Route path={PATH_RANKING} component={RankingContainer}/>
                        <Route path={PATH_USERSETTINGS} component={UserSettings}/>
                        <Route path={PATH_CONTACT} component={ContactContainer}/>
                        <Route exact path={"/"} component={Home}/>
                    </Switch>
                </Router>
            </div>
        </div>
    )

}