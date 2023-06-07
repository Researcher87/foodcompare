import React, {useContext} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {Form, FormGroup, Modal} from "react-bootstrap";
import {applicationStrings} from "../../../static/labels";
import ReactSelectOption from "../../../types/ReactSelectOption";
import {
    CHART_SIZE_LARGE,
    CHART_SIZE_MEDIUM,
    CHART_SIZE_SMALL,
} from "../../../config/Constants";
import {isMobileDevice} from "../../../service/WindowDimension";
import Select from 'react-select';
import ReactSelectOption from "../../../types/ReactSelectOption";

export interface JuxtapositionSettingsProps {
    onHide: () => void,
}

export function JustapositionSettings(props: JuxtapositionSettingsProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    if(!applicationContext) {
        throw Error("Application context is unavailable.")
    }

    const handleChartSizeChange = (selectionOption: ReactSelectOption) => {
        const newJuxtapositionConfigData = {
            ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
            chartSize: selectedOption
        }
        applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
    }

    const changeShowLabelState = (option: boolean) => {
        const newJuxtapositionConfigData = {
            ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
            showLabel: option
        }
        applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
    }

    const renderMenu = () => {
        const optionsChartSize: Array<ReactSelectOption> = [
            {label: applicationStrings.label_juxtaposition_settings_chartsize_s[language], value: CHART_SIZE_SMALL},
            {label: applicationStrings.label_juxtaposition_settings_chartsize_m[language], value: CHART_SIZE_MEDIUM},
            {label: applicationStrings.label_juxtaposition_settings_chartsize_l[language], value: CHART_SIZE_LARGE},
        ]

        const {showLabels, chartSize} = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData
        const classRow = isMobileDevice() ? "form-row-m" : "form-row"

        return <div>
            <form>
                <FormGroup controlId="formBasicText">
                    <div className="row">
                        <div className={classRow}>
                            <Form.Label className="form-label">
                                {applicationStrings.label_juxtaposition_settings_chartsize[language]}:
                            </Form.Label>
                            <Select options={optionsChartSize}
                                    value={chartSize}
                                    isSearchable={false}
                                    onChange={(value) => handleChartSizeChange(value)}
                            />
                        </div>
                        <div className={classRow}>
                            <Form.Check inline className="form-radiobutton"
                                        checked={showLabels === true}
                                        label={applicationStrings.label_juxtaposition_settings_showLabels[lang]}
                                        onClick={changeShowLabelState}>
                            </Form.Check>
                        </div>
                    </div>
                </FormGroup>
            </form>
        </div>
    }

    return (
        <Modal show={true}>
            <Modal.Header>
                <h5 className="modal-title"><b>{applicationStrings.modal_settings_title[language]}</b></h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.onHide}>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div style={{padding: "20px"}}>
                    {renderMenu()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button"
                        className="btn btn-primary"
                        onClick={props.onHide}>
                    {applicationStrings.button_close[language]}
                </button>
            </Modal.Footer>
        </Modal>
    )

}