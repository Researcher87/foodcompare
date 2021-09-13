import logo from '../static/image/logo.png'
import text from '../static/image/text.png'
import {Button} from "react-bootstrap";
import {
    LANGUAGE_DE,
    LANGUAGE_EN,
    PATH_FOODDATA_PANEL,
    PATH_HOME,
    PATH_CONTACT,
    PATH_USERSETTINGS,
    PATH_MOBILE_APP,
    PATH_DIRECT_COMPARE,
    PATH_FOODCOMPARE,
    SOURCE_SRLEGACY,
    PATH_RANKING,
    SOURCE_FNDDS
} from "../config/Constants";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {applicationStrings} from "../static/labels";
import {LanguageContext} from "../contexts/LangContext";
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';


export default function Header() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language, userLanguageChange} = useContext(LanguageContext)
    const location = useLocation();

    if (applicationContext === null) {
        return <div/>
    }

    const handleLanguageButtonClick = (event: any): void => {
        userLanguageChange(event.target.value)
        applicationContext.setFoodDataPanelData.updateAllFoodItemNames(applicationContext.foodDataCorpus.foodNames, event.target.value)
    }

    const handleSourceButtonClick = (event: any): void => {
        applicationContext.setPreferredSource(event.target.value)
    }

    let activePath = location.pathname && location.pathname !== "/" ? location.pathname : PATH_HOME
    if (activePath.endsWith("/") && activePath.length > 1) {
        activePath = activePath.substring(0, activePath.length - 1)
    }

    if (applicationContext.debug) {
        console.log('Path:', activePath)
    }

    const renderMenus = () => {
        return (
            <div className="btn-group" role="group">
                <div className="header-menu">
                    <Link to={PATH_HOME}>
                        <Button className="header-link"
                                value={PATH_HOME}
                                variant={'link'}
                                active={activePath === PATH_HOME || activePath === PATH_FOODCOMPARE}>
                            {applicationStrings.menu_home[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_FOODDATA_PANEL}>
                        <Button className="header-link"
                                value={PATH_FOODDATA_PANEL}
                                variant={'link'}
                                active={activePath === PATH_FOODDATA_PANEL}>
                            {applicationStrings.menu_food_data_panel[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_DIRECT_COMPARE}>
                        <Button className="header-link"
                                value={PATH_DIRECT_COMPARE}
                                variant={'link'}
                                active={activePath === PATH_DIRECT_COMPARE}>
                            {applicationStrings.menu_direct_compare[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_RANKING}>
                        <Button className="header-link"
                                value={PATH_RANKING}
                                variant={'link'}
                                active={activePath === PATH_RANKING}>
                            {applicationStrings.menu_ranking[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_MOBILE_APP}>
                        <Button className="header-link"
                                value={PATH_MOBILE_APP}
                                variant={'link'}
                                active={activePath === PATH_MOBILE_APP}>
                            {applicationStrings.menu_mobile_app[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_USERSETTINGS}>
                        <Button className="link header-link"
                                value={PATH_USERSETTINGS}
                                variant={'link'}
                                active={activePath === PATH_USERSETTINGS}>
                            {applicationStrings.menu_settings[language]}
                        </Button>
                    </Link>
                </div>
                <div className="header-menu">
                    <Link to={PATH_CONTACT}>
                        <Button className="link header-link"
                                variant={'link'}
                                value={PATH_CONTACT}
                                active={activePath === PATH_CONTACT}>
                            {applicationStrings.menu_contact[language]}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }


    const renderLanguageButtons = () => {
        return (
            <div className="form-language text-right">
                <form className="form-group">
                    <label className="form-elements">
                        <b>{applicationStrings.label_language[language]}</b>
                    </label>
                    <label className="form-elements">
                        <input className="form-radiobutton"
                               name={"user language"}
                               type="radio"
                               value={LANGUAGE_EN}
                               checked={language === LANGUAGE_EN}
                               onClick={handleLanguageButtonClick}
                        />
                        {applicationStrings.checkbox_english[language]}
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               name={"user language"}
                               type="radio"
                               value={LANGUAGE_DE}
                               checked={language === LANGUAGE_DE}
                               onClick={handleLanguageButtonClick}
                        />
                        {applicationStrings.checkbox_german[language]}
                    </label>
                </form>
            </div>
        )
    }


    const renderSourceButtons = () => {
        const preferredSource = applicationContext.applicationData.preferredSource

        return (
            <div className="form-language text-right" style={{paddingLeft: "25px"}}>
                <form className="form-group">
                    <label className="form-elements">
                        <b>{applicationStrings.label_preferred_source[language]}</b>
                    </label>
                    <label className="form-elements">
                        <input className="form-radiobutton"
                               type="radio"
                               value={SOURCE_SRLEGACY}
                               checked={preferredSource === SOURCE_SRLEGACY}
                               onChange={handleSourceButtonClick}
                        />
                        SR Legacy
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               type="radio"
                               value={SOURCE_FNDDS}
                               checked={(preferredSource === SOURCE_FNDDS)}
                               onChange={handleSourceButtonClick}
                        />
                        FNDDS (Survey)
                    </label>
                </form>
            </div>
        )
    }

    return (
        <div className="d-flex d-row header">
            <div style={{paddingTop: "8px", paddingLeft: "8px", minWidth: "90px", maxWidth: "90px"}}>
                <img src={logo}/>
            </div>
            <div className={"d-flex flex-column w-100"}>
                <div className="d-flex d-row align-items-center justify-content-between">
                    <div style={{paddingTop: "5px"}}>
                        <img src={text}/>
                    </div>
                    <div className="d-flex d-row justify-content-end" style={{paddingTop: "6px"}}>
                        {renderLanguageButtons()}
                        {renderSourceButtons()}
                    </div>
                </div>
                <div className="d-row" style={{marginTop: "3px"}}>
                    <div className="col-md-12 text-start">
                        {renderMenus()}
                    </div>
                </div>
            </div>
        </div>
    );

}