import logo from '../static/image/logo.png'
import text from '../static/image/text.png'
import {Button, Form} from "react-bootstrap";
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
    SOURCE_FNDDS, PATH_INFO
} from "../config/Constants";
import React, {useContext} from "react";
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

    console.debug(`Render Header: ${language}`)

    if (applicationContext === null) {
        return <div/>
    }

    const handleLanguageButtonClick = (event: any): void => {
        console.debug(`Handle language button click (org. lang / new event): ${language} / ${event.target.value}`)
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

        return (
            <div className={"btn-group flex flex-wrap"}>
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
                {!isMobileDevice() &&
                <Link to={PATH_DIRECT_COMPARE}>
                    <Button className={buttonContainerClass}
                            value={PATH_DIRECT_COMPARE}
                            variant={'link'}
                            active={activePath === PATH_DIRECT_COMPARE}>
                        {menuNameDirectCompare}
                    </Button>
                </Link>
                }
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
                <Link to={PATH_INFO}>
                    <Button className={buttonContainerClass}
                            variant={'link'}
                            value={PATH_INFO}
                            active={activePath === PATH_INFO}>
                        {applicationStrings.menu_info[language]}
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

    const labelClass = isMobileDevice() ? "header-form-label-m" : "header-form-label"

    const renderLanguageButtons = () => {
        return (
            <div className="header-form" style={{paddingRight: "1vw"}}>
                <span className={labelClass}>
                    {applicationStrings.label_language[language]}:
                </span>
                <Form.Check inline={true}
                            className="form-radiobutton"
                            label={language_en}
                            type="radio"
                            value={LANGUAGE_EN}
                            checked={language === LANGUAGE_EN}
                            onChange={handleLanguageButtonClick}>
                </Form.Check>
                <Form.Check inline={true}
                            className="form-radiobutton"
                            label={language_de}
                            type="radio"
                            value={LANGUAGE_DE}
                            checked={language === LANGUAGE_DE}
                            onChange={handleLanguageButtonClick}>
                </Form.Check>
            </div>
        )
    }


    const renderSourceButtons = () => {
        const preferredSource = applicationContext.applicationData.preferredSource

        return (
            <div className="header-form text-right" style={{paddingRight: "1vw"}}>
                <span className="header-form-label">
                    {applicationStrings.label_preferred_source[language]}:
                </span>
                <Form.Check inline={true}
                            className="form-radiobutton"
                            label={"SR Legacy"}
                            type="radio"
                            value={SOURCE_SRLEGACY}
                            checked={preferredSource === SOURCE_SRLEGACY}
                            onChange={handleSourceButtonClick}>
                </Form.Check>
                <Form.Check inline={true}
                            className="form-radiobutton"
                            label={"FNDDS (Survey)"}
                            type="radio"
                            value={SOURCE_FNDDS}
                            checked={preferredSource === SOURCE_FNDDS}
                            onChange={handleSourceButtonClick}>
                </Form.Check>
            </div>
        )
    }

    const headerClass = isMobileDevice() ? "header-m" : "header"

    return (
        <div className={`d-flex flex-row ${headerClass}`}>
            <img src={logo} className="header-logo" alt={"Food Compare Logo"}/>
            <div className={"d-flex flex-column w-100"} style={{paddingTop: "0.8vh", paddingLeft: "0.2vw"}}>
                <div className="d-flex flex-row align-items-center justify-content-between">
                    <div>
                        <img src={text} className="header-logo-text" alt={"Food Compare Logo Text"}/>
                    </div>
                    <div className="d-flex flex-row justify-content-end">
                        {!isMobileDevice() &&
                        renderSourceButtons()
                        }
                        {renderLanguageButtons()}
                    </div>
                </div>
                <div className="d-flex flex-row align-items-end" style={{height: "100%"}}>
                    <div className="flex-column text-start">
                        {renderMenus()}
                    </div>
                </div>
            </div>
        </div>
    );

}