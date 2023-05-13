import {useContext, useState} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {ContactForm} from "./ContactForm";
import {Sources} from "./Sources";
import {Versions} from "./Versions";
import {Impressum} from "./Impressum";
import {callEvent} from "../../service/GA_EventService";
import {
    GA_ACTION_CONTACT_SUBMENU,
    GA_CATEGORY_CONTACT
} from "../../config/GA_Events";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";

export function ContactContainer() {
    const languageContext = useContext(LanguageContext)
    const applicationContext = useContext(ApplicationDataContextStore)

    const menu_contact = 1
    const menu_sources = 2
    const menu_versions = 3
    const menu_impressum = 4


    const [selectedMenu, setSelectedMenu] = useState(menu_contact)
    const buttonStyle = {width: "175px"}

    const renderSubMenu = () => {
        switch (selectedMenu) {
            case menu_contact:
                return <ContactForm/>
            case menu_sources:
                return <Sources/>
            case menu_versions:
                return <Versions/>
            case menu_impressum:
                return <Impressum/>
            default:
                return <div/>
        }
    }

    const onChangeSubmenu = (selectedMenu) => {
        let label = ""
        switch(selectedMenu) {
            case menu_contact:
                label = "Contact"
                break
            case menu_sources:
                label = "Sources"
                break
            case menu_versions:
                label = "Versions"
                break
            case menu_impressum:
                label = "Impressum"
                break
        }

        callEvent(applicationContext?.debug, GA_ACTION_CONTACT_SUBMENU, GA_CATEGORY_CONTACT, label)
        setSelectedMenu(selectedMenu)
    }

    return (
        <div>
            <div className={"text-center"} style={{paddingTop: "25px", paddingBottom: "50px"}}>
                <ToggleButtonGroup className={"contact"}
                                   type={"radio"}
                                   name={"contact menus"}
                                   defaultValue={menu_contact}>
                    <ToggleButton style={buttonStyle}
                                  value={menu_contact}
                                  checked={selectedMenu === menu_contact}
                                  onChange={() => onChangeSubmenu(menu_contact)}>
                        {applicationStrings.menu_contact[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_sources}
                                  checked={selectedMenu === menu_sources}
                                  onChange={() => onChangeSubmenu(menu_sources)}>
                        {applicationStrings.menu_contact_sources[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_versions}
                                  checked={selectedMenu === menu_versions}
                                  onChange={() => onChangeSubmenu(menu_versions)}>
                        {applicationStrings.menu_contact_versions[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_impressum}
                                  checked={selectedMenu === menu_impressum}
                                  onChange={() => onChangeSubmenu(menu_impressum)}>
                        {applicationStrings.menu_contact_impressum[languageContext.language]}
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div>
                {renderSubMenu()}
            </div>
        </div>
    )

}