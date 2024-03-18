import {HelpText} from "../service/HelpService";
import React, {ReactElement, useContext} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {Modal} from "react-bootstrap";
import {applicationStrings} from "../static/labels";

interface SpinnerModalProps {
    text: String,
}

export function SpinnerModal(props: SpinnerModalProps): ReactElement {
    return (
        <Modal size="sm"
               show={true}
               backdrop="static"
        >
            <Modal.Body>
                <div>{props.text}</div>
            </Modal.Body>
        </Modal>
    )
}