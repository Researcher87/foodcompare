import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider from "./contexts/ApplicationDataContext";
import FoodDataPanelContainer from "./components/fooddatapanel/FoodDataPanelContainer";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import {MENU_FOODDATAPANEL, MENU_HOME, MENU_CONTACT, MENU_RANKING, MENU_SETTINGS} from "./config/Constants";
import {LanguageProvider} from "./contexts/LangContext";
import {UserSettings} from "./components/UserSettings";
import {Contact} from "./components/Contact";
import ReactTooltip from "react-tooltip";
import ReactGa from "react-ga"
import {ANALYTICS_MESS_ID} from "./config/GoogleTools";

function App() {
    const [selectedMenu, setSelectedMenu] = useState<string | null>(MENU_FOODDATAPANEL)

    useEffect(() => {
        ReactGa.initialize(ANALYTICS_MESS_ID)
        ReactGa.pageview("/")
        ReactTooltip.rebuild()
    })

    const changeMenu = (event: any) => {
        setSelectedMenu(event.target.value)
    }

    if (!selectedMenu) {
        return <div/>
    }

    return (
        <div className="App">
            <div>
                <NotificationContainer/>
                <ReactTooltip />
                <LanguageProvider>
                    <ApplicationDataContextProvider>
                        <Header changeMenu={changeMenu} selectedMenu={selectedMenu}/>
                        {selectedMenu === MENU_FOODDATAPANEL &&
                            <FoodDataPanelContainer />
                        }
                        {selectedMenu === MENU_SETTINGS &&
                            <UserSettings />
                        }
                        {selectedMenu === MENU_CONTACT &&
                        <Contact />
                        }
                    </ApplicationDataContextProvider>
                </LanguageProvider>
            </div>
        </div>
    );
}

(async () => {
    try {   // NOTE: uBlock Origin may cause a crash here
        await ga4react.initialize();
    } catch(e) {
        console.error(e)
    }

    render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById("root")
    );
})();

export default App;
