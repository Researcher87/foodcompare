import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";

import dataprivacy from "../../static/dataprivacy.json";

export function DataPrivacy() {

    const language = useContext(LanguageContext).language

    return (
        <div className={"container"}>
            <p>
                {dataprivacy[0][language]}
            </p>
            <p>
                {dataprivacy[1][language]}
            </p>
            <p>
                <a href="https://www.fastcounter.de/de/privacy/40519.htm">https://www.fastcounter.de/de/privacy/40519.htm</a>.
            </p>
            <p>
                {dataprivacy[2][language]}
            </p>
            <p>
                <a href="https://www.fastcounter.de/datenschutz.html">https://www.fastcounter.de/datenschutz.html</a>
            </p>
        </div>
    )

}