import React, {ReactElement, useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {Form, FormControl, FormGroup, Modal} from "react-bootstrap";
import {applicationStrings} from "../../../static/labels";
import {NutrientCondition} from "../../../types/livedata/NutrientCondition";
import {customSelectStyles} from "../../../config/UI_Config";
import Select from 'react-select';
import {getElementsOfRankingGroup, getNutrientGroup, getNutrientGroups} from "../../../service/RankingService";
import ReactSelectOption from "../../../types/ReactSelectOption";
import {getStatisticalNutrientInformation} from "../../../service/nutrientdata/NutrientStatisticsService";
import {getSourceId} from "../../../service/Source";
import {getUnit} from "../../../service/calculation/NutrientCalculationService";
import {autoRound} from "../../../service/calculation/MathService";
import NutrientStatistics from "../../../types/livedata/NutrientStatistics";
import {SOURCE_SRLEGACY} from "../../../config/Constants";
import {NotificationManager} from 'react-notifications'
import {FaLightbulb} from "react-icons/fa";

interface NutrientFilterSelectionProps {
    closeModal: () => void
    existingCondition?: NutrientCondition,
    addCondition?: (condition: NutrientCondition) => void
    editCondition?: (condition: NutrientCondition) => void
}

export function NutrientFilterSelectionModal(props: NutrientFilterSelectionProps): ReactElement {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    const nutrientGroups = getNutrientGroups(language);

    const initialElementsList = getElementsOfRankingGroup(nutrientGroups[0].value, language)
    const initialElement = props.existingCondition
        ? props.existingCondition.nutrient
        : initialElementsList && initialElementsList.length > 0
            ? initialElementsList[0]
            : null  // Fallback


    const initialGroup = props.existingCondition
        ? initialElement
            ? getNutrientGroup(initialElement.value, language) !== undefined
                ? getNutrientGroup(initialElement.value, language)!!
                : nutrientGroups[0] // Fallback
            : nutrientGroups[0] // Fallback
        : nutrientGroups[0]

    const foodItems = applicationContext?.foodDataCorpus.foodItems ?? []
    const preferredSourceId = getSourceId(applicationContext?.applicationData.preferredSource ?? SOURCE_SRLEGACY)
    const initialStatistics = initialElement ? getStatisticalNutrientInformation(initialElement.value, foodItems, preferredSourceId) : null

    const [elementsList, setElementsList] = useState<Array<any>>(initialElementsList ?? [])
    const [selectedGroup, setSelectedGroup] = useState<ReactSelectOption>(initialGroup)
    const [selectedElement, setSelectedElement] = useState<any>(initialElement)
    const [nutrientStatistics, setNutrientStatistics] = useState<NutrientStatistics | null>(null)

    const initialMin = props.existingCondition
        ? props.existingCondition.min
        : initialStatistics
            ? initialStatistics.minimumAmount ?? 0
            : 0

    const initialMax = props.existingCondition
        ? props.existingCondition.max
        : initialStatistics
            ? initialStatistics.maximumAmount ?? 999
            : 999

    const [minValue, setMinValue] = useState<number>(initialMin)
    const [maxValue, setMaxValue] = useState<number>(initialMax)

    useEffect(() => {
        if (applicationContext) {
            if (!props.existingCondition) {
                const statisticalNutrientInformation = getStatisticalNutrientInformation(selectedElement.value, foodItems, preferredSourceId)
                setNutrientStatistics(statisticalNutrientInformation)
                setMinValue(statisticalNutrientInformation.minimumAmount ?? 0)
                setMaxValue(statisticalNutrientInformation.maximumAmount ?? 999)
            } else {
                const statisticalNutrientInformation = getStatisticalNutrientInformation(props.existingCondition.nutrient.value,
                    foodItems, preferredSourceId)
                setNutrientStatistics(statisticalNutrientInformation)
            }
        }
    }, [selectedElement])


    if (!applicationContext) {
        return <div/>
    }

    const handleGroupChange = (selectedOption) => {
        setSelectedGroup(selectedOption)
        const newElementsList = getElementsOfRankingGroup(selectedOption.value, language)
        setElementsList(newElementsList)
        setSelectedElement(newElementsList[0])
    }

    const handleValueChange = (selectedOption) => {
        setSelectedElement(selectedOption)
    }

    const setMinimum = (event: any) => {
        const min = event.target.value

        if (isNaN(min)) {
            return
        }

        const minValue = parseFloat(min)
        if(isNaN(minValue)) {
            setMinValue(0)
            return
        }

        if (nutrientStatistics && nutrientStatistics.minimumAmount !== null && minValue < nutrientStatistics.minimumAmount) {
            NotificationManager.info(applicationStrings.message_filter_value_correction_min[language])
            setMinValue(nutrientStatistics.minimumAmount)
        } else if (nutrientStatistics && nutrientStatistics.maximumAmount !== null && minValue > nutrientStatistics.maximumAmount) {
            NotificationManager.info(applicationStrings.message_filter_value_correction_max[language])
            setMinValue(nutrientStatistics.maximumAmount)
            setMaxValue(nutrientStatistics.maximumAmount)
        } else {
            setMinValue(minValue)
        }
    }

    const setMaximum = (event: any) => {
        const max = event.target.value

        if (isNaN(max)) {
            return
        }

        const maxValue = parseFloat(max)
        if(isNaN(maxValue)) {
            setMaxValue(0)
            return
        }

        if (nutrientStatistics && nutrientStatistics.maximumAmount !== null && maxValue > nutrientStatistics.maximumAmount) {
            NotificationManager.info(applicationStrings.message_filter_value_correction_max[language])
            setMaxValue(nutrientStatistics.maximumAmount)
        } else if (nutrientStatistics && nutrientStatistics.minimumAmount !== null && maxValue < nutrientStatistics.minimumAmount) {
            NotificationManager.info(applicationStrings.message_filter_value_correction_min[language])
            setMinValue(nutrientStatistics.minimumAmount)
            setMaxValue(nutrientStatistics.minimumAmount)
        } else {
            setMaxValue(maxValue)
        }
    }

    const onAddCondition = () => {
        const nutrient = selectedElement.value

        if (applicationContext.applicationData.nutrientFilter.find(condition => condition.nutrient.value === nutrient) !== undefined) {
            NotificationManager.error(applicationStrings.message_filter_error_existing[language])
            return
        }

        if (minValue > maxValue) {
            NotificationManager.error(applicationStrings.message_filter_error_range[language])
            return
        }

        const condition: NutrientCondition = {
            nutrient: selectedElement,
            min: minValue,
            max: maxValue,
        }

        if (props.addCondition) {
            props.addCondition(condition)
        } else {
            props.closeModal()
        }
    }

    const onEditCondition = () => {
        if (minValue > maxValue) {
            NotificationManager.error(applicationStrings.message_filter_error_range[language])
            return
        }

        const changedCondition: NutrientCondition = {...props.existingCondition!!, min: minValue, max: maxValue}
        if (props.editCondition) {
            props.editCondition(changedCondition)
        } else {
            props.closeModal()
        }
    }

    const onSubmit = () => {
        if (props.existingCondition) {
            onEditCondition()
        } else {
            onAddCondition()
        }
    }


    const renderForm = () => {
        const inputFieldStyle = {padding: "0.3ch", margin: "0ch"}

        return (
            <div>
                <div className={"select-menu form-section"}>
                    <span className={"form-label"}>{applicationStrings.label_group[language]}:</span>
                    <Select className="form-control-sm"
                            options={nutrientGroups}
                            isDisabled={props.existingCondition}
                            value={selectedGroup}
                            styles={customSelectStyles}
                            onChange={handleGroupChange}
                    />
                </div>
                <div className={"select-menu form-section"}>
                    <span className={"form-label"}>{applicationStrings.label_value[language]}:</span>
                    <Select className="form-control-sm"
                            options={elementsList}
                            isDisabled={props.existingCondition}
                            value={selectedElement}
                            styles={customSelectStyles}
                            onChange={handleValueChange}
                    />
                </div>
                <div className={"d-flex flex-row"}>
                    <FormGroup>
                        <div className={"d-flex flex-row"}>
                            <Form className={"form-elements"}>
                                <Form.Label style={{margin: "0"}}>Min:</Form.Label>
                                <FormControl
                                    className={"form-control input"}
                                    style={inputFieldStyle}
                                    type="number"
                                    value={`${minValue}`}
                                    onChange={setMinimum}
                                />
                            </Form>
                            <Form className={"form-elements"}>
                                <Form.Label style={{margin: "0"}}>Max:</Form.Label>
                                <FormControl
                                    className={"form-control input"}
                                    style={inputFieldStyle}
                                    type="number"
                                    value={`${maxValue}`}
                                    onChange={setMaximum}
                                />
                            </Form>
                        </div>
                    </FormGroup>
                </div>
            </div>
        )
    }

    const renderInfoPane = () => {
        if (!nutrientStatistics) {
            return <div/>
        }

        const foodItems = applicationContext.foodDataCorpus.foodItems

        const getInfoHeaderText = (): string => {
            const allValues = foodItems.length
            const availableValues = nutrientStatistics.allValuesSorted.length
            const nutrientName = selectedElement.label

            const inRange = nutrientStatistics.allValuesSorted.filter(val => val >= minValue && val <= maxValue).length

            /*
             * MANUAL TRANSLATION because of the text complexity.
             */

            let infoText = language === "de"
                ? `Von den ${allValues} vorhandenen Lebensmitteln haben ${availableValues} Angaben zu ${nutrientName}.`
                : `Out of ${allValues} available foods ${availableValues} contain information about ${nutrientName}.`

            if (inRange < availableValues) {
                if (inRange > 1) {
                    infoText += language === "de"
                        ? ` Insgesamt liegen im eingegebenen Wertebereich ${inRange} verschiedene Lebensmittel.`
                        : ` The specified data range altogether contains ${inRange} different food items.`
                } else if (inRange === 1) {
                    infoText += language === "de"
                        ? ` In dem eingegebenen Wertebereich befindet sich 1 Lebensmittel.`
                        : ` The specified data range contains 1 food items.`
                } else {
                    infoText += language === "de"
                        ? ` In dem eingegeben Wertebereich befindet sich kein Lebensmittel!`
                        : ` No food item is in the specified data range.`
                }
            }

            return infoText
        }

        const unit = getUnit(selectedElement.value)
        const keyStyle = {minWidth: "12ch"}

        return (
            <div className={"form-text"} style={{paddingLeft: "2ch"}}>
                <div>
                    <div style={{minHeight: "15vh"}}>
                        <FaLightbulb/> {getInfoHeaderText()}
                    </div>
                </div>
                <div style={{paddingLeft: "3.5ch"}}>
                    <div className={"d-flex flex-row"}>
                        <div style={keyStyle}><b>Minimum:</b></div>
                        <div>{nutrientStatistics.minimumAmount} {unit}</div>
                    </div>
                    <div className={"d-flex flex-row"}>
                        <div style={keyStyle}><b>Maximum:</b></div>
                        <div>{nutrientStatistics.maximumAmount} {unit}</div>
                    </div>
                    <div className={"d-flex flex-row"}>
                        <div style={keyStyle}><b>{applicationStrings.label_overallview_avg[language]}:</b></div>
                        <div>{autoRound(nutrientStatistics.averageAmount)} {unit}</div>
                    </div>
                    <div className={"d-flex flex-row"}>
                        <div style={keyStyle}><b>Median:</b></div>
                        <div>{autoRound(nutrientStatistics.median)} {unit}</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Modal className={"filter-selection-modal"}
               size={'lg'}
               show={true}
               backdrop="static">
            <Modal.Header>
                <h5 className="modal-title">{applicationStrings.label_filterModal_selection[language]}</h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className={"container row"} style={{height: "38vh"}}>
                    <div className={"col-6"}>
                        {renderForm()}
                    </div>
                    <div className={"col-6"}>
                        {renderInfoPane()}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className={"justify-content-end"}>
                <div>
                    <button type="button"
                            className="btn btn-secondary"
                            onClick={props.closeModal}>
                        {applicationStrings.button_close[language]}
                    </button>
                </div>
                <div>
                    <span>
                        <button type="button"
                                className="btn btn-primary"
                                onClick={onSubmit}>
                            {applicationStrings.button_add[language]}
                        </button>
                    </span>
                </div>
            </Modal.Footer>
        </Modal>
    )
}