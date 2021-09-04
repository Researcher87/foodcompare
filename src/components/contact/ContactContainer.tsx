import {useContext, useState} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {ContactForm} from "./ContactForm";
import {Sources} from "./Sources";
import {Versions} from "./Versions";
import {Impressum} from "./Impressum";

export function ContactContainer() {
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const menu_contact = 1
    const menu_sources = 2
    const menu_versions = 3
    const menu_impressum = 4

    const [selectedMenu, setSelectedMenu] = useState(menu_contact)

    const renderDisclaimer = () => {
        return (
            <div>
                <p>
                    <b>{applicationStrings.text_contact_disclaimer1[lang]}</b>
                </p>
                <p>
                    <i>
                        {applicationStrings.text_contact_disclaimer2[lang]}
                    </i>
                </p>
            </div>
        )
    }


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
                                  onChange={() => setSelectedMenu(menu_contact)}>
                        {applicationStrings.menu_contact[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_sources}
                                  checked={selectedMenu === menu_sources}
                                  onChange={() => setSelectedMenu(menu_sources)}>
                        {applicationStrings.menu_contact_sources[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_versions}
                                  checked={selectedMenu === menu_versions}
                                  onChange={() => setSelectedMenu(menu_versions)}>
                        {applicationStrings.menu_contact_versions[languageContext.language]}
                    </ToggleButton>
                    <ToggleButton style={buttonStyle}
                                  value={menu_impressum}
                                  checked={selectedMenu === menu_impressum}
                                  onChange={() => setSelectedMenu(menu_impressum)}>
                        {applicationStrings.menu_contact_impressum[languageContext.language]}
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div>
                {renderSubMenu()}
            </div>
        </div>
    )


    // return(
    //     <div className="container-fluid"  style={{paddingLeft: "50px", paddingTop: "20px"}}>
    //         <div className="row">
    //             <div className="col-6" style={{paddingBottom: "40px", paddingRight: "80px"}}>
    //                 <div>
    //                     <h1>
    //                         Food Compare
    //                     </h1>
    //                     <h6>
    //                         Version {release}
    //                     </h6>
    //                     <h6>
    //                         Build time: {buildDate}
    //                     </h6>
    //                 </div>
    //                 <div style={{paddingTop: "50px"}}>
    //                     {renderDisclaimer()}
    //                     {renderSources()}
    //                 </div>
    //             </div>
    //             <div className="col-6">
    //                 <div style={{height: '180px'}}>
    //                     <img src={impressumPath} style={{height: '180px'}} />
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //    )

}