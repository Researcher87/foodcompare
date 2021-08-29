import {useContext} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {applicationStrings} from "../static/labels";

import appPath from '../static/image/app.png';
import {mobileAppPath} from "../config/ApplicationSetting";
import MobileDeviceCheck from "./MobileDeviceCheck";

export function FoodCompareApp() {
    const languageContext = useContext(LanguageContext)

    const linkToPlayStore = () => {
        const link = window.open(mobileAppPath, '_blank')
        if(link) {
            link.focus()
        } else {
            window.location.href = mobileAppPath
        }
    }

    return <div className={"container media app"} style={{paddingTop: "24px"}}>
        <div className={"row"}>
            <div className={"col-6"}>
                {applicationStrings.text_foodcompareapp_1[languageContext.language]}
                <div className="text-center" style={{paddingTop: "32px"}}>
                    <button type="button"
                            className="btn btn-warning btn-small button-apply media app"
                            onClick={linkToPlayStore}
                            style={{minWidth: "250px"}}>
					<span className={"media app"} style={{fontWeight: "bold"}}>
						{applicationStrings.text_foodcompareapp_2[languageContext.language]}
					</span>
                    </button>
                </div>
            </div>
            <div className={"col-6"}>
                <img src={appPath} className={"media mobile-app-img"}/>
            </div>
        </div>
    </div>

}