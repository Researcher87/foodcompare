import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";

import impressum_de from '../../static/image/impressum-german.png';
import impressum_en from '../../static/image/impressum-english.png';
import {applicationStrings} from "../../static/labels";
import {LANGUAGE_DE} from "../../config/Constants";
import {isMobileDevice} from "../../service/WindowDimension";

export function Impressum() {
    const lang = useContext(LanguageContext).language

    const impressumPath = lang === LANGUAGE_DE ? impressum_de : impressum_en;
    const columnClass = isMobileDevice() ? "col-10" : "col-6"

    return (
        <div className={"container"} style={{paddingBottom: "30px"}}>
            <div className={columnClass}>
                <p>
                    <b>{applicationStrings.text_contact_disclaimer1[lang]}</b>
                </p>
                <p>
                    <i>
                        {applicationStrings.text_contact_disclaimer2[lang]}
                    </i>
                </p>
                <p>
                    <i>
                        {applicationStrings.text_contact_disclaimer3[lang]}
                    </i>
                </p>
            </div>
            <div style={{paddingTop: "20px"}}>
                <div style={{height: '180px'}}>
                    <img src={impressumPath} alt={"Impressumtext"} style={{height: '180px'}}/>
                </div>
            </div>
        </div>
    )

}