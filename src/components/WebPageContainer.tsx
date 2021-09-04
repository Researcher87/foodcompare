import Header from "./Header";
import Switch from "react-bootstrap/Switch";
import {
    PATH_CONTACT,
    PATH_DIRECT_COMPARE,
    PATH_FOODCOMPARE,
    PATH_FOODDATA_PANEL,
    PATH_HOME,
    PATH_MOBILE_APP,
    PATH_USERSETTINGS
} from "../config/Constants";
import {Home} from "./Home";
import FoodDataPanelContainer from "./fooddatapanel/FoodDataPanelContainer";
import DirectCompareContainer from "./directcompare/DirectCompareContainer";
import {FoodCompareApp} from "./FoodCompareApp";
import {UserSettings} from "./UserSettings";
import {ContactContainer} from "./contact/ContactContainer";
import React, {useContext} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {isMobile} from "react-device-detect";

export function WebPageContainer() {

    const applicationContext = useContext(ApplicationDataContextStore)

    if (!applicationContext) {
        return <div/>
    }

    // NOTE: If the user is on a mobile device, we only render the page after he decided whether he wants to stay or not

    console.log('Is mobile:', isMobile)

    return (
        <div>
            {(isMobile === false || applicationContext.useAsMobile !== null) &&
            <Router>
                <Header/>
                <Switch>
                    <Route path={PATH_FOODCOMPARE} component={Home}/>
                    <Route path={PATH_HOME} component={Home}/>
                    <Route path={PATH_FOODDATA_PANEL} component={FoodDataPanelContainer}/>
                    <Route path={PATH_DIRECT_COMPARE} component={DirectCompareContainer}/>
                    <Route path={PATH_MOBILE_APP} component={FoodCompareApp}/>
                    <Route path={PATH_USERSETTINGS} component={UserSettings}/>
                    <Route path={PATH_CONTACT} component={ContactContainer}/>
                    <Route exact path={"/"} component={Home}/>
                </Switch>
            </Router>
            }
        </div>
    )

}