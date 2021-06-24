import React from "react";
import PropTypes from "prop-types";

import {confirmable, createConfirmation} from "react-confirm";
import {Button, Modal} from "react-bootstrap";
import {applicationStrings} from "../static/labels";

interface ConfirmationDialogProps {
    okLabel: string,
    cancelLabel: string,
    title: string,
    confirmation: string,
    show: boolean,
    proceed: (procedd: boolean) => void, // called when ok button is clicked.
    enableEscape: boolean
};

class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {

    render() {
        const {
            okLabel,
            cancelLabel,
            title,
            confirmation,
            show,
            proceed,
            enableEscape = true
        } = this.props;

        return (
            <div className="static-modal">
                <Modal
                    show={show}
                    onHide={() => proceed(false)}
                    backdrop={enableEscape ? true : "static"}
                    keyboard={enableEscape}
                >
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{confirmation}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => proceed(false)}>{cancelLabel}</Button>
                        <Button
                            className="primary button-l"
                            onClick={() => proceed(true)}>
                            {okLabel}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}


export function confirmAction(
    confirmation,
    okLabel,
    cancelLabel,
    options = {}
) {
    return createConfirmation(confirmable(ConfirmationDialog))({
        confirmation,
        okLabel,
        cancelLabel,
        ...options
    });
}
