import React, {useContext} from "react";
import {applicationStrings} from "../static/labels";
import {LanguageContext} from "../contexts/LangContext";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {Button} from "react-bootstrap";
import {isMobileDevice} from "../service/WindowDimension";

export default function MobileDeviceCheck() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const setMobileStatus = (status: boolean) => {
        applicationContext?.setMobileUsage(status)
    }

    const showMobileInformationModal = () => {
        return <div className={"mobile-device-message"}>
            <div style={{margin: "15px"}}>
                {applicationStrings.device_detection_hint[language]}
            </div>
            <div className={"d-flex justify-content-center"}>
                <Button
                    style={{minWidth: "80px"}}
                    className="primary button-l"
                    onClick={() => setMobileStatus(false)}>
                    OK
                </Button>
            </div>
        </div>
    }

    return <div>
        {applicationContext?.useAsMobile === null && isMobileDevice() &&
        < div>
            {showMobileInformationModal()}
        </div>
        }
    </div>

}