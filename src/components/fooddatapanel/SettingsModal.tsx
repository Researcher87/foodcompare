import React, {useContext} from "react";
import {Button, Form, FormControl, FormGroup, Modal} from "react-bootstrap";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {isMobileDevice} from "../../service/WindowDimension";
import {
    DISPLAY_REQ_ABSOLUTE, DISPLAY_REQ_RELATIVE,
    OPTION_NO,
    OPTION_YES,
    UNIT_GRAM,
    UNIT_MICROGRAM,
    UNIT_MILLIGRAM
} from "../../config/Constants";
import Select from 'react-select';
import ReactSelectOption from "../../types/ReactSelectOption";

interface SettingsProps {
    onHide: () => void
}

export default function SettingsModal(props: SettingsProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    const handleUnitVitaminsChange = (selectionOption: ReactSelectOption) => {
        if (applicationContext) {
            let dataSettings = {...applicationContext.dataSettings, unitVitamins: selectionOption.value}
            applicationContext.setDataSettings(dataSettings)
        }
    }

    const handleUnitProteinsChange = (selectionOption: ReactSelectOption) => {
        if (applicationContext) {
            let dataSettings = {...applicationContext.dataSettings, unitProteins: selectionOption.value}
            applicationContext.setDataSettings(dataSettings)
        }
    }

    const handleIncludeProvitaminsChange = (selectionOption: ReactSelectOption) => {
        if (applicationContext) {
            let dataSettings = {...applicationContext.dataSettings, includeProvitamins: selectionOption.value}
            applicationContext.setDataSettings(dataSettings)
        }
    }

    const handleDisplayRequirementsChange = (selectionOption: ReactSelectOption) => {
        if (applicationContext) {
            let dataSettings = {...applicationContext.dataSettings, dietaryRequirementsDisplay: selectionOption.value}
            applicationContext.setDataSettings(dataSettings)
        }
    }

    const renderMenu = () => {
        const optionsVitamins: Array<ReactSelectOption> = [
            {label: applicationStrings._milligram[language], value: UNIT_MILLIGRAM},
            {label: applicationStrings._microgram[language], value: UNIT_MICROGRAM},
        ]
        const selectedUnitVitamins = applicationContext?.dataSettings.unitVitamins
        const selectedOptionVitamins = optionsVitamins.find(option => option.value === selectedUnitVitamins)

        const optionsProteins: Array<ReactSelectOption> = [
            {label: applicationStrings._gram[language], value: UNIT_GRAM},
            {label: applicationStrings._microgram[language], value: UNIT_MILLIGRAM},
        ]
        const selectedUnitProteins = applicationContext?.dataSettings.unitProteins
        const selectedOptionProteins = optionsProteins.find(option => option.value === selectedUnitProteins)

        const optionsProvitamins: Array<ReactSelectOption> = [
            {label: applicationStrings._option_yes[language], value: OPTION_YES},
            {label: applicationStrings._option_no[language], value: OPTION_NO},
        ]
        const includeProvitamins = applicationContext?.dataSettings.includeProvitamins
        const selectedOptionProvitamins = optionsProvitamins.find(option => option.value === includeProvitamins)

        const optionsDisplayRequirements: Array<ReactSelectOption> = [
            {label: applicationStrings.modal_settings_option_dailyrequirements_absolute[language], value: DISPLAY_REQ_ABSOLUTE},
            {label: applicationStrings.modal_settings_option_dailyrequirements_relative[language], value: DISPLAY_REQ_RELATIVE},
        ]
        const selectedDisplayRequirement = applicationContext?.dataSettings.dietaryRequirementsDisplay
        const selectedDisplayRequirementsOption = optionsDisplayRequirements.find(option => option.value === selectedDisplayRequirement)

        const classRow = isMobileDevice() ? "form-row-m" : "form-row"

        return <div>
            <form>
                <FormGroup controlId="formBasicText">
                    <div className="row">
                        <div className={classRow}>
                            <Form.Label className="form-label">
                                {applicationStrings.modal_settings_label_unit_vitamins[language]}:
                            </Form.Label>
                            <Select options={optionsVitamins}
                                    value={selectedOptionVitamins}
                                    isSearchable={false}
                                    onChange={(value) => handleUnitVitaminsChange(value)}
                            />
                        </div>
                        <div className={classRow}>
                            <Form.Label className="form-label">
                                {applicationStrings.modal_settings_label_unit_proteins[language]}:
                            </Form.Label>
                            <Select options={optionsProteins}
                                    value={selectedOptionProteins}
                                    isSearchable={false}
                                    onChange={(value) => handleUnitProteinsChange(value)}
                            />
                        </div>
                        <div className={classRow}>
                            <Form.Label className="form-label">
                                {applicationStrings.modal_settings_label_dietaryRequirments[language]}:
                            </Form.Label>
                            <Select options={optionsDisplayRequirements}
                                    value={selectedDisplayRequirementsOption}
                                    isSearchable={false}
                                    onChange={(value) => handleDisplayRequirementsChange(value)}
                            />
                        </div>
                        <div className={classRow}>
                            <Form.Label className="form-label">
                                {applicationStrings.modal_settings_label_provitamins[language]}:
                            </Form.Label>
                            <Select options={optionsProvitamins}
                                    value={selectedOptionProvitamins}
                                    isSearchable={false}
                                    onChange={(value) => handleIncludeProvitaminsChange(value)}
                            />
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