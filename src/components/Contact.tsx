import {useContext} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {applicationStrings} from "../static/labels";
import {LANGUAGE_DE} from "../config/Constants";

import impressum_de from '../static/image/impressum-german.png';
import impressum_en from '../static/image/impressum-english.png';
import {buildDate, release} from "../config/ApplicationSetting";

export function Contact() {
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const renderDisclaimer = () => {
        return(
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

    const renderSources = () => {
        return (
            <div style={{paddingTop: "50px"}}>
                <h4>{applicationStrings.text_contact_source1[lang]}</h4>
                <h5>{applicationStrings.text_contact_source2[lang]}</h5>
                <p>U.S. Department of Agriculture, Agricultural Research Service.<br/>
                FoodData Central, 2019. fdc.nal.usda.gov.</p>
                <h5>{applicationStrings.text_contact_source3[lang]}</h5>
                <p>Deutsche Gesellschaft für Ernährung e.V.</p>
                <h5>{applicationStrings.text_contact_source4[lang]}</h5>
                <p>Prakash S. Shetty, Christiani J. K. Henry, Alison E. Black and A. M. Prentice:<br/>
                    "Energy requirements of adults: an update on basal metabolic rates (BMRs) and physical activity levels (PALs).",<br/>
                    European journal of clinical nutrition (1996), Volume 50, Suppl 1, pp. 11-23
                </p>
            </div>
        );
    }


    const impressumPath = lang === LANGUAGE_DE ? impressum_de : impressum_en;

    return(
        <div className="container-fluid"  style={{paddingLeft: "50px", paddingTop: "20px"}}>
            <div className="row">
                <div className="col-6" style={{paddingBottom: "40px", paddingRight: "80px"}}>
                    <div>
                        <h1>
                            Food Compare
                        </h1>
                        <h6>
                            Version {release}
                        </h6>
                        <h6>
                            Build time: {buildDate}
                        </h6>
                    </div>
                    <div style={{paddingTop: "50px"}}>
                        {renderDisclaimer()}
                        {renderSources()}
                    </div>
                </div>
                <div className="col-6">
                    <div style={{height: '180px'}}>
                        <img src={impressumPath} style={{height: '180px'}} />
                    </div>
                </div>
            </div>
        </div>
    )

}