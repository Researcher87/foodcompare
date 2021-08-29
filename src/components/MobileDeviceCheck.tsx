import {MobileView} from "react-device-detect";
import React, {useContext} from "react";
import {applicationStrings} from "../static/labels";
import {confirmAction} from "./ConfirmationDialog";
import {LanguageContext} from "../contexts/LangContext";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {mobileAppPath} from "../config/ApplicationSetting";

export default function MobileDeviceCheck() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const showQuestionModal = () => {
        const confirm = async () => {
            const message = applicationStrings.device_detection_hint[language] + " " + applicationStrings.device_detection_question[language]

            if (await confirmAction(
                message,
                applicationStrings.button_yes[language],
                applicationStrings.button_no[language],
                {}
            )) {
                applicationContext?.setMobileUsage(true)
                return true
            } else {
                applicationContext?.setMobileUsage(false)
                return false
            }
        }

        confirm().then(result => {
            if(result) {
                window.location.href = mobileAppPath
            }
        })

        return <div/>
    }

    return <div>
        {applicationContext?.useAsMobile === null &&
        < MobileView>
            {showQuestionModal()}
        </MobileView>
        }
    </div>

}