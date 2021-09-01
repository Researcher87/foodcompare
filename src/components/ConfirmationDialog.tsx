import React from "react";

import {confirmable, createConfirmation} from "react-confirm";
import {Button, Modal} from "react-bootstrap";

interface ConfirmationDialogProps {
    okLabel: string,
    cancelLabel: string,
    title: string,
    confirmation: string,
    show: boolean,
    proceed: (procedd: boolean) => void, // called when ok button is clicked.
    enableEscape: boolean,
    small?: boolean
}

class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {

    render() {
        const {
            okLabel,
            cancelLabel,
            title,
            confirmation,
            show,
            proceed,
            enableEscape = true,
            small
        } = this.props;

        const size = small ? "sm" : "lg"

        return (
            <Modal
                show={show}
                onHide={() => proceed(false)}
                backdrop={enableEscape ? true : "static"}
                keyboard={enableEscape}
                fullscreen={true}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmation}</Modal.Body>
                <Modal.Footer>
                    <Button style={{minWidth: "80px"}}
                            onClick={() => proceed(false)}>
                        {cancelLabel}
                    </Button>
                    <Button
                        style={{minWidth: "80px"}}
                        className="primary button-l"
                        onClick={() => proceed(true)}>
                        {okLabel}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}


export function confirmAction(
    confirmation,
    okLabel,
    cancelLabel,
    options = {},
    small?
) {
    return createConfirmation(confirmable(ConfirmationDialog))({
        confirmation,
        okLabel,
        cancelLabel,
        ...options,
        small
    });
}
