import Header from "./Header";
import Switch from "react-bootstrap/Switch";
import {
    PATH_CONTACT,
    PATH_DIRECT_COMPARE,
    PATH_FOODCOMPARE,
    PATH_FOODDATA_PANEL,
    PATH_HOME, PATH_INFO,
    PATH_RANKING,
    PATH_USERSETTINGS
} from "../config/Constants";
import {Home} from "./Home";
import FoodDataPanelContainer from "./fooddatapanel/FoodDataPanelContainer";
import DirectCompareContainer from "./directcompare/DirectCompareContainer";
import {UserSettings} from "./UserSettings";
import {ContactContainer} from "./contact/ContactContainer";
import React, {useContext} from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {RankingContainer} from "./ranking/RankingContainer";
import {Chart, ArcElement} from 'chart.js'
import annotationPlugin from "chartjs-plugin-annotation";
import {InfoContainer} from "./InfoSiteContainer";

export function WebPageContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)

    if (!applicationContext) {
        return <div/>
    }

    // Registering requires some time and should only be performed when the real site is loaded.
    if (applicationContext.debug) {
        console.log('Start annotation plugin registration...')
    }
    Chart.register(annotationPlugin)
    Chart.register(ArcElement);
    if (applicationContext.debug) {
        console.log('...done.')
    }

    if (applicationContext.debug) {
        //require('./../App-debug.scss');
    }

    const _fccX: Array<Array<string>> | null = null;

    const counter = (): void => {
        let fcr = Math.floor(Math.random() * 99999999999);
        let _fcc: Array<Array<string>> | null = _fccX || [];
        _fcc.push(["40519"]);
        _fcc.push(["trans"]);
        (function () {
            var fc = document.createElement("script");
            fc.async = true;
            fc.src = "https://www.imcounter.com/fcount.php?rnd=" + fcr;
            var sc = document.getElementById("fc-40519");
            if (sc) {
            }
            if (sc) {
                sc.appendChild(fc);
            }
        })();
    }

    return (
        <div>
            {!applicationContext.debug &&
            <span>
               <span id="fc-40519">{counter()}</span>
                <a href="https://www.fastcounter.de/stats/40519/dashboard" rel="nofollow" style={{display: "none"}} target="_blank"
                   title="Kostenloser Besucherz&auml;hler"><img src="https://www.imcounter.com/fcounter.php?id=40519;"
                                                                alt="Kostenloser Besucherz&auml;hler"
                                                                title="Kostenloser Besucherz&auml;hler"/></a>
            </span>
            }

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
                        <Route path={PATH_INFO} component={InfoContainer}/>
                        <Route exact path={"/"} component={Home}/>
                    </Switch>
                </Router>
            </div>
        </div>
    )

}