import React, {ReactElement, useContext, useEffect, useState} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {applicationStrings} from "../static/labels";
import ReactSelectOption from "../types/ReactSelectOption";
import {isSmallScreen, useWindowDimension} from "../service/WindowDimension";
import {NotificationManager} from 'react-notifications'
import Select from 'react-select';
import {Modal} from "react-bootstrap";

export interface Unit {
    factor: number,
    labelKey: string
}

interface UnitConversionProps {
    sourceUnits: Array<Unit>
    targetUnitLabelKey: string
    allowedMinimumTargetValue: number
    allowedMaximumTargetValue: number
    initialValue?: number
    onSubmit: (value) => void
    closeModal: () => void
}

export const UnitConversionModal: React.FC<UnitConversionProps> = (props: UnitConversionProps): ReactElement => {
    const language = useContext(LanguageContext).language
    const windowSize = useWindowDimension()

    const unitOptions = props.sourceUnits.map((sourceUnit, index) => {
        return {
            value: index,
            label: applicationStrings[sourceUnit.labelKey][language]
        }
    })

    const [selectedUnitOption, setSelectedUnitOption] = useState<ReactSelectOption>(unitOptions[0])
    const [inputValue, setInputValue] = useState<number>(props.initialValue ? props.initialValue : 1)
    const [convertedValue, setConvertedValue] = useState<number | null>(null)

    useEffect(() => {
        if (!isNaN(inputValue)) {
            const unit = props.sourceUnits[selectedUnitOption.value]
            setConvertedValue(Math.round(inputValue * unit.factor))
        } else {
            setConvertedValue(null)
        }
    }, [inputValue, selectedUnitOption])

    const onInputChange = (event) => {
        const val = event.target.value
        setInputValue(val)
    }

    const isValidConversion = () => {
        return convertedValue !== null && convertedValue >= props.allowedMinimumTargetValue
            && convertedValue <= props.allowedMaximumTargetValue
    }

    const submit = () => {
        if (isValidConversion()) {
            props.onSubmit(convertedValue)
            props.closeModal()
        } else {
            NotificationManager.error(applicationStrings.message_error_input[language])
        }
    }

    const makeForm = () => {
        const inputClass = isSmallScreen(windowSize)
            ? "form-control form-control-sm input-sm w-50"
            : "form-control input"

        const fontColor = isValidConversion()
            ? "black"
            : "#cc0000"

        return (
            <div>
                <div className={"form-section"}>
                    <div className={"d-flex flex-row"}>
                        <input className={inputClass}
                               style={{width: "30%"}}
                               value={inputValue}
                               onChange={onInputChange}
                        />
                        <div style={{width: "70%"}}>
                            <Select options={unitOptions}
                                    value={selectedUnitOption}
                                    isSearchable={false}
                                    onChange={(value) => setSelectedUnitOption(value)}
                            />
                        </div>
                    </div>
                </div>
                <div style={{paddingTop: "2vh", paddingLeft: "1vw", color: fontColor}}>
                    {convertedValue !== null ?
                        (
                            <span>
                                <span><b>{convertedValue}</b></span>
                                <span style={{paddingLeft: "0.75ch"}}>
                                    <b>{applicationStrings[props.targetUnitLabelKey][language]}</b>
                                </span>
                            </span>
                        )
                        :
                        (
                            <span><b>{applicationStrings.label_error[language]}</b></span>
                        )
                    }

                </div>
            </div>
        )
    }

    return (
        <Modal className={"unit-modal"}
               size={"sm"}
               show={true}
               onHide={props.closeModal}
               backdrop="static"
        >
            <Modal.Header>
                <h5 className="modal-title">{applicationStrings.label_unit_conversion_title[language]}</h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                {makeForm()}
            </Modal.Body>
            <Modal.Footer>
                <button type="button"
                        className="btn btn-secondary"
                        onClick={props.closeModal}>
                    {applicationStrings.button_close[language]}
                </button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={() => submit()}>
                    {applicationStrings.button_submit[language]}
                </button>
            </Modal.Footer>
        </Modal>
    )
}