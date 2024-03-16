import React, {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {Form, FormGroup, Modal} from "react-bootstrap";
import {applicationStrings} from "../../../static/labels";
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

    const currentSettings = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData
    const [chartSize, setChartSize] = useState<number>(currentSettings.chartSize)
    const [showLabels, setShowLabels] = useState<boolean>(currentSettings.showLabels)

    const saveData = () => {
        const newJuxtapositionConfigData = {
            ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
            chartSize: chartSize,
            showLabels: showLabels
        }

        applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
        props.onHide()
    }

    const renderMenu = () => {
        const optionsChartSize: Array<ReactSelectOption> = [
            {label: applicationStrings.label_juxtaposition_settings_chartsize_s[language], value: CHART_SIZE_SMALL},
            {label: applicationStrings.label_juxtaposition_settings_chartsize_m[language], value: CHART_SIZE_MEDIUM},
            {label: applicationStrings.label_juxtaposition_settings_chartsize_l[language], value: CHART_SIZE_LARGE},
        ]

        const chartSizeOption = optionsChartSize[chartSize]

        const classRow = isMobileDevice() ? "form-row-m" : "form-row"

        return <div>
            <form>
                <FormGroup controlId="formBasicText">
                    <div className="row">
                        <div className={classRow}>
                            <Form.Label>
                                {applicationStrings.label_juxtaposition_settings_chartsize[language]}:
                            </Form.Label>
                            <Select options={optionsChartSize}
                                    value={chartSizeOption}
                                    isSearchable={false}
                                    onChange={(option) => setChartSize(option.value)}
                            />
                        </div>
                        <div className={classRow}>
                            <Form.Check inline className="form-radiobutton"
                                        checked={showLabels}
                                        label={applicationStrings.label_juxtaposition_settings_showLabels[language]}
                                        onChange={() => setShowLabels(!showLabels)}>
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
                        onClick={() => saveData()}>
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
                        onClick={() => saveData()}>
                    {applicationStrings.button_close[language]}
                </button>
            </Modal.Footer>
        </Modal>
    )

}