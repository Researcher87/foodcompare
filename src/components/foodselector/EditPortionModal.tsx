import React, {ReactElement, useContext, useState} from "react";
import {Modal} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {correspondingSelectElementStyle} from "../../config/UI_Config";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {NotificationManager} from 'react-notifications'
import {maximalPortionSize} from "../../config/ApplicationSetting";

interface EditPortionModalProps {
    portionAmount: number,
    foodName: string,
    closeModal: () => void
    submitNewPortion: (portion) => void
}

export function EditPortionModal(props: EditPortionModalProps): ReactElement {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    const [newPortion, setNewPortion] = useState(props.portionAmount)

    if (!applicationContext) {
        return <div/>
    }

    const submitNewPortion = () => {
        if (newPortion < 1 || newPortion > maximalPortionSize) {
            NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
            return;
        }

        props.submitNewPortion(newPortion)
        props.closeModal()
    }

    const updatePortionValue = (e) => {
        const value = e.target.value

        if (isNaN(value)) {
            return
        }

        const valNum = parseInt(value)
        setNewPortion(valNum)
    }

    return (
        <Modal size={'sm'} show={true}>
            <Modal.Header>
                <h5 className="modal-title">{props.foodName}</h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body">
                    <div>
                        <span className={'form-label'}>{applicationStrings.label_edit_portion[language]}</span>
                        <input className={"form-control"}
                               value={newPortion}
                               style={correspondingSelectElementStyle}
                               onChange={value => updatePortionValue(value)}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <button type="button"
                            className="btn btn-secondary form-button-sm"
                            onClick={props.closeModal}>
                        {applicationStrings.button_cancel[language]}
                    </button>
                    <button type="button"
                            className="btn btn-primary form-button-sm"
                            onClick={submitNewPortion}>
                        {applicationStrings.button_submit[language]}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )

}