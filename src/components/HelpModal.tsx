import {ReactElement, useContext} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {applicationStrings} from "../static/labels";
import {HelpText} from "../service/HelpService";

interface HelpModalProps {
    helpText: HelpText
    closeHelpModal: () => void
}

export function HelpModal(props: HelpModalProps): ReactElement {
    const languageContext = useContext(LanguageContext)

    if (!props.helpText) {
        return (<div>No data available.</div>);
    }


    return (
        <div className="modal" style={{display: "block"}} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{props.helpText.title}</h5>
                        <button type="button"
                                className="btn-close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={props.closeHelpModal}>
                        </button>
                    </div>
                    <div className="modal-body">
                        <span dangerouslySetInnerHTML={{__html: props.helpText.content}}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-primary"
                                onClick={props.closeHelpModal}>
                            {applicationStrings.button_close[languageContext.language]}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}