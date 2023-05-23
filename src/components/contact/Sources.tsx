import {applicationStrings} from "../../static/labels";
import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";

export function Sources() {
    const language = useContext(LanguageContext).language

    return (
        <div className={"container"}>
            <h4><b>{applicationStrings.text_contact_source1[language]}</b></h4>
            <h5>{applicationStrings.text_contact_source2[language]}</h5>
            <p>U.S. Department of Agriculture, Agricultural Research Service.<br/>
                FoodData Central, 2021-2023.</p>
            <p>
                Website: <a href={"https://fdc.nal.usda.gov/"}>Food Data Central</a>
            </p>
            <h5>{applicationStrings.text_contact_source3[language]}</h5>
            <p>Deutsche Gesellschaft für Ernährung e.V.</p>
            <p>
                Website: <a href={"https://www.dge.de/"}>DGE</a>
            </p>
            <h5>{applicationStrings.text_contact_source4[language]}</h5>
            <p>Prakash S. Shetty, Christiani J. K. Henry, Alison E. Black and A. M. Prentice:<br/>
                "Energy requirements of adults: an update on basal metabolic rates (BMRs) and physical activity
                levels (PALs).",<br/>
                European journal of clinical nutrition (1996), Volume 50, Suppl 1, pp. 11-23
            </p>
        </div>
    );

}