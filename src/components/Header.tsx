import logo from '../static/image/logo.png'
import text from '../static/image/text.png'
import {Button} from "react-bootstrap";
import {
    LANGUAGE_DE,
    LANGUAGE_EN,
    MENU_FOODDATAPANEL,
    MENU_HOME,
    MENU_CONTACT,
    MENU_RANKING,
    MENU_SETTINGS
} from "../config/Constants";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {applicationStrings} from "../static/labels";
import {LanguageContext} from "../contexts/LangContext";

interface HeaderProps {
    selectedMenu: string
    changeMenu: (event: any) => void
}

export default function Header(props: HeaderProps) {
    const applicationData = useContext(ApplicationDataContextStore)
    const {language, userLanguageChange} = useContext(LanguageContext)

    if (applicationData === null) {
        return <div/>
    }

    const handleLanguageButtonClick = (event: any): void => {
        userLanguageChange(event.target.value)
    }

    const renderMenus = () => {
        return (
            <div className="btn-group" role="group">
                {/*<div className="header-menu">*/}
                {/*    <Button className="header-link"*/}
                {/*            value={MENU_HOME}*/}
                {/*            variant={'link'}*/}
                {/*            active={props.selectedMenu === MENU_HOME}*/}
                {/*            onClick={props.changeMenu}>*/}
                {/*        {applicationStrings.menu_home[language]}*/}
                {/*    </Button>*/}
                {/*</div>*/}
                <div className="header-menu">
                    <Button className="header-link"
                            value={MENU_FOODDATAPANEL}
                            variant={'link'}
                            active={props.selectedMenu === MENU_FOODDATAPANEL}
                            onClick={props.changeMenu}>
                        {applicationStrings.menu_food_data_panel[language]}
                    </Button>
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
                    <Button className="link header-link"
                            value={MENU_SETTINGS}
                            variant={'link'}
                            active={props.selectedMenu === MENU_SETTINGS}
                            onClick={props.changeMenu}>
                        {applicationStrings.menu_settings[language]}
                    </Button>
                </div>
                <div className="header-menu">
                    <Button className="link header-link"
                            variant={'link'}
                            value={MENU_CONTACT}
                            active={props.selectedMenu === MENU_CONTACT}
                            onClick={props.changeMenu}>
                        {applicationStrings.menu_contact[language]}
                    </Button>
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