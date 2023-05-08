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
import {isMobileDevice} from "../service/WindowDimension";


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
        const menuNameAnalyze = isMobileDevice() ? applicationStrings.menu_food_data_panel_m[language] : applicationStrings.menu_food_data_panel[language]
        const menuNameDirectCompare = isMobileDevice() ? applicationStrings.menu_direct_compare_m[language] : applicationStrings.menu_direct_compare[language]
        const menuNameRanking = isMobileDevice() ? applicationStrings.menu_ranking_m[language] : applicationStrings.menu_ranking[language]
        const menuNameSettings = isMobileDevice() ? applicationStrings.menu_settings_m[language] : applicationStrings.menu_settings[language]

        const buttonContainerClass = isMobileDevice() ? "link header-link-mobile" : "link header-link"

        const menuClass = isMobileDevice() ? "btn-group" : "btn-group flex flex-wrap"

        return (
            <div className={menuClass}>
                <Link to={PATH_HOME}>
                    <Button className={buttonContainerClass}
                            value={PATH_HOME}
                            variant={'link'}
                            active={activePath === PATH_HOME || activePath === PATH_FOODCOMPARE}>
                        {applicationStrings.menu_home[language]}
                    </Button>
                </Link>
                <Link to={PATH_FOODDATA_PANEL}>
                    <Button className={buttonContainerClass}
                            value={PATH_FOODDATA_PANEL}
                            variant={'link'}
                            active={activePath === PATH_FOODDATA_PANEL}>
                        {menuNameAnalyze}
                    </Button>
                </Link>
                <Link to={PATH_DIRECT_COMPARE}>
                    <Button className={buttonContainerClass}
                            value={PATH_DIRECT_COMPARE}
                            variant={'link'}
                            active={activePath === PATH_DIRECT_COMPARE}>
                        {menuNameDirectCompare}
                    </Button>
                </Link>
                <Link to={PATH_RANKING}>
                    <Button className={buttonContainerClass}
                            value={PATH_RANKING}
                            variant={'link'}
                            active={activePath === PATH_RANKING}>
                        {menuNameRanking}
                    </Button>
                </Link>
                <Link to={PATH_USERSETTINGS}>
                    <Button className={buttonContainerClass}
                            value={PATH_USERSETTINGS}
                            variant={'link'}
                            active={activePath === PATH_USERSETTINGS}>
                        {menuNameSettings}
                    </Button>
                </Link>
                <Link to={PATH_CONTACT}>
                    <Button className={buttonContainerClass}
                            variant={'link'}
                            value={PATH_CONTACT}
                            active={activePath === PATH_CONTACT}>
                        {applicationStrings.menu_contact[language]}
                    </Button>
                </Link>
            </div>
        )
    }

    const language_en = isMobileDevice() ? applicationStrings.checkbox_english_m[language] : applicationStrings.checkbox_english[language]
    const language_de = isMobileDevice() ? applicationStrings.checkbox_german_m[language] : applicationStrings.checkbox_german[language]

    const renderLanguageButtons = () => {
        return (
            <div className="form-small text-right">
                <form>
                    <label className="form-elements">
                        <b>{applicationStrings.label_language[language]}</b>
                    </label>
                    <label className="form-elements">
                        <input className="form-radiobutton"
                               name={"user language"}
                               type="radio"
                               value={LANGUAGE_EN}
                               defaultChecked={language === LANGUAGE_EN}
                               onClick={handleLanguageButtonClick}
                        />
                        {language_en}
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               name={"user language"}
                               type="radio"
                               value={LANGUAGE_DE}
                               defaultChecked={language === LANGUAGE_DE}
                               onClick={handleLanguageButtonClick}
                        />
                        {language_de}
                    </label>
                </form>
            </div>
        )
    }


    const renderSourceButtons = () => {
        const preferredSource = applicationContext.applicationData.preferredSource

        return (
            <div className="form-small text-right" style={{paddingLeft: "25px"}}>
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

    const makeHeaderDesktop = () => {
        return (
            <div className="d-flex flex-row header">
                <div style={{paddingTop: "8px", paddingLeft: "8px", minWidth: "90px", maxWidth: "90px"}}>
                    <img src={logo} alt={"Food Compare Logo"}/>
                </div>
                <div className={"d-flex flex-column w-100"}>
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <div style={{paddingTop: "5px"}}>
                            <img src={text} alt={"Food Compare Logo Text"}/>
                        </div>
                        <div className="d-flex flex-row justify-content-end" style={{paddingTop: "6px"}}>
                            {renderLanguageButtons()}
                            {!isMobileDevice() && renderSourceButtons()}
                        </div>
                    </div>
                    <div className="d-flex flex-row" style={{marginTop: "3px"}}>
                        <div className="col-md-12 text-start">
                            {renderMenus()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const makeHeaderMobile = () => {
        return (
            <div className="d-flex flex-column header" style={{overflowX: "hidden"}}>
                <div className={"d-flex flex-row justify-content-between"}>
                    <div className={"d-flex flex-row"}>
                        <div style={{paddingTop: "4px", paddingLeft: "4px", minWidth: "40px", maxWidth: "40px"}}>
                            <img src={logo} width={"32px"} alt={"Food Compare Logo (mobile)"}/>
                        </div>
                        <div style={{paddingTop: "8px"}}>
                            <img src={text} width={"67px"} alt={"Food Compare Logo text (mobile)"}/>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex flex-row justify-content-end" style={{paddingTop: "6px"}}>
                                {renderLanguageButtons()}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: "3px"}}>
                    {renderMenus()}
                </div>
            </div>
        );
    }

    return isMobileDevice() ? makeHeaderMobile() : makeHeaderDesktop()
}