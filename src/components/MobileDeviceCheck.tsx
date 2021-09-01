import {isMobile} from "react-device-detect";
import React, {useContext} from "react";
import {applicationStrings} from "../static/labels";
import {LanguageContext} from "../contexts/LangContext";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {Button} from "react-bootstrap";
import {mobileAppPath} from "../config/ApplicationSetting";

export default function MobileDeviceCheck() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)


    const setMobileStatus = (status: boolean) => {
        if(status === true) {
            window.location.href = mobileAppPath
        } else {
            applicationContext?.setMobileUsage(status)
        }
    }

    const showQuestionModal2 = () => {
        const message=applicationStrings.device_detection_hint[language]

        return <div className={"mobile-device-message"}>
            <div style={{margin: "15px"}}>
                {message}
            </div>
            <div className={"d-flex justify-content-center"}>
                <Button style={{minWidth: "80px", marginRight: "40px"}}
                        onClick={() => setMobileStatus(true)}>
                    {applicationStrings.button_yes[language]}
                </Button>
                <Button
                    style={{minWidth: "80px"}}
                    className="primary button-l"
                    onClick={() => setMobileStatus(false)}>
                    {applicationStrings.button_no[language]}
                </Button>
            </div>
        </div>
    }

    return <div>
        {applicationContext?.useAsMobile === null &&
        < div>
            {showQuestionModal2()}
        </div>
        }
    </div>

}