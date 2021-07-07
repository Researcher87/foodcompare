import logo from '../static/image/logo.png'
import text from '../static/image/text.png'
import {Button} from "react-bootstrap";
import {
    LANGUAGE_DE,
    LANGUAGE_EN,
    PATH_FOODDATA_PANEL,
    PATH_HOME,
    PATH_CONTACT,
    PATH_RANKING,
    PATH_USERSETTINGS, PATH_MOBILE_APP, PATH_FOODCOMPARE
} from "../config/Constants";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {applicationStrings} from "../static/labels";
import {LanguageContext} from "../contexts/LangContext";
import {Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export default function Header() {
    const applicationData = useContext(ApplicationDataContextStore)
    const {language, userLanguageChange} = useContext(LanguageContext)
    const location = useLocation();

    if (applicationData === null) {
        return <div/>
    }

    const handleLanguageButtonClick = (event: any): void => {
        userLanguageChange(event.target.value)
        applicationData.updateAllFoodItemNames(applicationData.foodDataCorpus.foodNames, event.target.value)
    }

    const activePath = location.pathname && location.pathname !== "/" ? location.pathname : PATH_HOME

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
                {/*<div className="header-menu">*/}
                {/*    <Button className="blink header-link"*/}
                {/*            value={MENU_RANKING}*/}
                {/*            variant={'link'}*/}
                {/*            active={props.selectedMenu === MENU_RANKING}*/}
                {/*            onClick={props.changeMenu}>*/}
                {/*        {applicationStrings.menu_ranking[language]}*/}
                {/*    </Button>*/}
                {/*</div>*/}
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
                               type="radio"
                               value={LANGUAGE_EN}
                               checked={language === LANGUAGE_EN}
                               onChange={handleLanguageButtonClick}
                        />
                        {applicationStrings.checkbox_english[language]}
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               type="radio"
                               value={LANGUAGE_DE}
                               checked={(language === LANGUAGE_DE)}
                               onChange={handleLanguageButtonClick}
                        />
                        {applicationStrings.checkbox_german[language]}
                    </label>
                </form>
            </div>
        )
    }

    return (
        <div className="container-fluid">
            <div className="row header">
                <div className="col-1"
                     style={{paddingLeft: "10px", paddingTop: "8px", minWidth: "120px", maxWidth: "120px"}}>
                    <img src={logo}/>
                </div>
                <div className="col">
                    <div className="container-fluid">
                        <div className="row" float-start>
                            <div className="col-5 text-start" style={{paddingTop: "5px"}}>
                                <img src={text}/>
                            </div>
                            <div className="col text-end" style={{paddingTop: "6px"}}>
                                {renderLanguageButtons()}
                            </div>
                        </div>
                        <div className="row" style={{marginTop: "3px"}}>
                            <div className="col-md-12 text-start">
                                {renderMenus()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}