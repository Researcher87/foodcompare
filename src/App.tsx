import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import {NotificationContainer} from 'react-notifications'
import ApplicationDataContextProvider from "./contexts/ApplicationDataContext";
import FoodDataPanelContainer from "./components/fooddatapanel/FoodDataPanelContainer";
import React, {useEffect, useState} from "react";
import Header from "./components/Header";
import {MENU_FOODDATAPANEL, MENU_HOME, MENU_CONTACT, MENU_RANKING, MENU_SETTINGS, MENU_APP} from "./config/Constants";
import {LanguageProvider} from "./contexts/LangContext";
import {UserSettings} from "./components/UserSettings";
import {Contact} from "./components/Contact";
import ReactTooltip from "react-tooltip";
import GA4React, {useGA4React} from "ga-4-react";
import {ANALYTICS_MESS_ID} from "./config/GoogleTools";
import {render} from "react-dom";
import {Home} from "./components/Home";
import {FoodCompareApp} from "./components/FoodCompareApp";


const ga4react = new GA4React(ANALYTICS_MESS_ID);

function App(): JSX.Element {
    const ga = useGA4React();

    const [selectedMenu, setSelectedMenu] = useState<string | null>(MENU_HOME)

    useEffect(() => {
        ReactTooltip.rebuild()
    }, [selectedMenu])

    const changeMenu = (event: any) => {
        setSelectedMenu(event.target.value)
    }

    const switchToFoodSelectionMenu = () => {
        setSelectedMenu(MENU_FOODDATAPANEL)
    }

    if (!selectedMenu) {
        return <div/>
    }

    return (
        <div className="App">
            <div>
                <NotificationContainer/>
                <ReactTooltip/>
                <LanguageProvider>
                    <ApplicationDataContextProvider>
                        <Header changeMenu={changeMenu} selectedMenu={selectedMenu}/>
                        {selectedMenu === MENU_HOME &&
                        <Home switchToFoodSelectionMenu={switchToFoodSelectionMenu}/>
                        }
                        {selectedMenu === MENU_FOODDATAPANEL &&
                        <FoodDataPanelContainer/>
                        }
                        {selectedMenu === MENU_APP &&
                        <FoodCompareApp/>
                        }
                        {selectedMenu === MENU_SETTINGS &&
                        <UserSettings/>
                        }
                        {selectedMenu === MENU_CONTACT &&
                        <Contact/>
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
