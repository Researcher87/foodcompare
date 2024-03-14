import React, {ReactElement, useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {Button, Form, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {applicationStrings} from "../../../static/labels";
import {FaEdit, FaQuestionCircle, FaTrash} from "react-icons/fa";
import {getHelpText} from "../../../service/HelpService";
import {HelpModal} from "../../HelpModal";
import {NutrientFilterSelectionModal} from "./NutrientFilterSelection";
import {NutrientCondition} from "../../../types/livedata/NutrientCondition";
import {getUnit} from "../../../service/calculation/NutrientCalculationService";
import ReactTooltip from "react-tooltip";
import {filterFoodItems} from "../../../service/nutrientdata/FilterService";
import {FilteredFoodItem} from "../../../types/livedata/SelectedFoodItem";
import Select from 'react-select';
import {getFoodItemName} from "../../../service/nutrientdata/FoodItemsService";
import ReactSelectOption from "../../../types/ReactSelectOption";
import {OPERATOR_ALL, OPERATOR_ANY} from "../../../config/Constants";
import {getSourceId} from "../../../service/Source";

interface FilterModalProps {
    closeModal: () => void
    selectFoodItemFromFilterModal: (selectedFilterResult: FilteredFoodItem) => void
}

export function FilterModal(props: FilterModalProps): ReactElement {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
    const [showNutrientFilterModal, setShowNutrientFilterModal] = useState<boolean>(false)
    const [editingCondition, setEditingCondition] = useState<NutrientCondition | null>(null)
    const [filterResult, setFilterResult] = useState<Array<FilteredFoodItem>>([])
    const [selectList, setSelectList] = useState<Array<ReactSelectOption>>([])
    const [selectedFilterResult, setSelectedFilterResult] = useState<ReactSelectOption | null>(null)
    const [calculationTypeAny, setCalculationTypeAny] = useState<boolean>(false)

    useEffect(() => {
        if (!applicationContext) {
            return
        }
        const {foodItems} = applicationContext.foodDataCorpus
        const filterConditions = applicationContext?.applicationData.nutrientFilter
        const preferredSource = applicationContext.applicationData.preferredSource
        const preferredSourceId = getSourceId(preferredSource)

        const operator = calculationTypeAny ? OPERATOR_ANY : OPERATOR_ALL

        if (foodItems && filterConditions) {
            const filterData = filterFoodItems(foodItems, filterConditions, operator, preferredSourceId)
            setFilterResult(filterData)
            const {foodNames} = applicationContext.foodDataCorpus
            const selectList = filterData.map((filterResult) => {
                const foodName = getFoodItemName(filterResult.foodItem, foodNames, language)
                return {
                    value: filterResult.foodItem.id,
                    label: foodName ?? ""
                }
            })

            if (selectList && selectList.length > 1) {
                selectList.sort((obj1, obj2) => obj1.label.localeCompare(obj2.label))
            }

            setSelectList(selectList)
            if (selectList.length > 0) {
                setSelectedFilterResult(selectList[0])
            } else {
                setSelectedFilterResult(null)
            }
        }
        if (filterConditions.length === 0) {
            setSelectedFilterResult(null)
        }
    }, [applicationContext?.applicationData.nutrientFilter, calculationTypeAny])

    if (!applicationContext) {
        return <div/>
    }

    const onOpenHelpModal = () => {
        setShowHelpModal(true)
    }

    const onOpenNutrientSelectorModal = () => {
        setShowNutrientFilterModal(true)
    }

    const addCondition = (condition: NutrientCondition) => {
        const filter = [...applicationContext.applicationData.nutrientFilter]
        filter.push(condition)
        applicationContext.setNutrientFilter(filter)
        setShowNutrientFilterModal(false)
    }

    const editCondition = (editCondition: NutrientCondition) => {
        const filter = [...applicationContext.applicationData.nutrientFilter].map(existingCondition => {
            return existingCondition.nutrient.value !== editCondition.nutrient.value
                ? existingCondition
                : editCondition
        })
        applicationContext.setNutrientFilter(filter)
        setEditingCondition(null)
        setShowNutrientFilterModal(false)
    }

    const onEditCondition = (condition: NutrientCondition) => {
        setEditingCondition(condition)
        setShowNutrientFilterModal(true)
    }

    const onRemoveCondition = (condition: NutrientCondition) => {
        const filter = [...applicationContext.applicationData.nutrientFilter].filter(c => c.nutrient.value !== condition.nutrient.value)
        applicationContext.setNutrientFilter(filter)
    }

    const closeFilterSelectionModal = () => {
        setEditingCondition(null) // Reset the Edit-state under all circumstances
        setShowNutrientFilterModal(false)
    }

    const selectFoodItem = () => {
        const result = filterResult.find(entry => entry.foodItem.id === selectedFilterResult?.value)

        if (result) {
            props.selectFoodItemFromFilterModal(result);
        }
        props.closeModal()
    }

    const handleSelectionClick = (selection: ReactSelectOption) => {
        setSelectedFilterResult(selection)
    }

    const helpText = getHelpText(13, language)

    const renderFilterListEntry = (condition: NutrientCondition) => {
        const nutrient = condition.nutrient.value
        const unit = getUnit(nutrient)

        return (
            <ListGroupItem key={`lg-${condition.nutrient.value}`}>
                <div><b>{condition.nutrient.label}</b></div>
                <div className={"d-flex flex-row justify-content-between align-items-middle"}>
                    <div className={"d-flex flex-row"}>
                        <div style={{marginRight: "1ch"}}><i>Min:</i></div>
                        <div style={{marginRight: "3ch"}}><i>{condition.min} {unit}</i></div>
                        <div style={{marginRight: "1ch"}}><i>Max:</i></div>
                        <div style={{marginRight: "3ch"}}><i>{condition.max} {unit}</i></div>
                    </div>
                    <div>
                        <Button onClick={() => onEditCondition(condition)}
                                style={{marginRight: "1ch"}}
                                className={"btn btn-secondary"}
                                data-for={"fa-btn-edit"}
                                data-tip={applicationStrings.tooltip_filter_edit[language]}>
                            <FaEdit/>
                            <ReactTooltip id={"fa-btn-edit"} globalEventOff="click"/>
                        </Button>
                        <Button onClick={() => onRemoveCondition(condition)}
                                className={"btn btn-secondary"}
                                data-for={"fa-btn-close"}
                                data-tip={applicationStrings.tooltip_filter_remove[language]}>
                            <FaTrash/>
                            <ReactTooltip id={"fa-btn-close"}/>
                        </Button>
                    </div>
                </div>
            </ListGroupItem>
        )
    }

    const renderFilterList = () => {
        return (
            <div style={{height: "50vh", overflowY: "auto"}}>
                {applicationContext.applicationData.nutrientFilter.length > 0
                    ?
                    (
                        <ListGroup>
                            {applicationContext.applicationData.nutrientFilter.map(condition => renderFilterListEntry(condition))}
                        </ListGroup>
                    ):
                    (
                        <div>
                            {applicationStrings.label_filterModal_note_addCondition[language]}
                        </div>
                    )
                }
            </div>
        )
    }


    const renderResultList = () => {
        if (applicationContext.applicationData.nutrientFilter.length === 0) {
            return <div/>
        }

        if (filterResult.length === 0) {
            return <div>
                {applicationStrings.label_filterModal_note_noData[language]}
            </div>
        }

        const resultMessage = filterResult.length === 1
            ? `${filterResult.length} ${applicationStrings.label_result[language]}`
            : `${filterResult.length} ${applicationStrings.label_results[language]}`

        return (
            <div>
                <div className={"form-section"}>
                    <span className={'form-label'}>{applicationStrings.label_selection[language]}:</span>
                    <Select options={selectList}
                            value={selectedFilterResult ? selectedFilterResult : selectList[0]}
                            onChange={handleSelectionClick}
                    />
                </div>
                <div>
                    {resultMessage}
                </div>
            </div>
        )
    }

    const renderLeftFooterPart = () => {
        return (
            <div>
                <span style={{paddingRight: "2ch"}}>
                    <Button className={"btn btn-secondary"} onClick={onOpenHelpModal}>
                        <FaQuestionCircle/>
                    </Button>
                </span>
                <span>
                        <button type="button"
                                className="btn btn-primary"
                                onClick={onOpenNutrientSelectorModal}>
                            {applicationStrings.label_filterModal_add[language]}
                        </button>
                    </span>
                <span style={{paddingLeft: "5ch"}}>
                        <Form.Label className={"form-elements"}>
                            <b>{applicationStrings.button_mode[language]}:</b>
                        </Form.Label>
                        <Form.Check className="form-radiobutton mr-4"
                                    type="radio"
                                    inline={true}
                                    label={applicationStrings.label_mode_all[language]}
                                    checked={!calculationTypeAny}
                                    onChange={() => setCalculationTypeAny(false)}
                        />
                        <Form.Check className="form-radiobutton form-horizontal-separation"
                                    type="radio"
                                    inline={true}
                                    label={applicationStrings.label_mode_any[language]}
                                    checked={calculationTypeAny}
                                    onChange={() => setCalculationTypeAny(true)}
                        />
                    </span>
            </div>
        )
    }

    const renderRightFooterPart = () => {
        return (
            <div className={"d-flex flex-row justify-content-end"}>
                <div style={{paddingRight: "2ch"}}>
                    <button type="button"
                            className="btn btn-secondary"
                            onClick={props.closeModal}>
                        {applicationStrings.button_close[language]}
                    </button>
                </div>
                <div>
                    <button type="button"
                            className="btn btn-primary"
                            disabled={selectedFilterResult === null}
                            onClick={selectFoodItem}>
                        {applicationStrings.button_select[language]}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <Modal className={"filter-modal"}
               size={'xl'}
               show={true}
               backdrop="static">
            <Modal.Header>
                <h5 className="modal-title">{applicationStrings.label_filterModal_title[language]}</h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                {showHelpModal && helpText !== null &&
                <HelpModal helpText={helpText}
                           size={"lg"}
                           closeHelpModal={() => setShowHelpModal(false)}/>
                }
                {showNutrientFilterModal && editingCondition === null &&
                <NutrientFilterSelectionModal closeModal={closeFilterSelectionModal}
                                              addCondition={addCondition}
                />
                }
                {showNutrientFilterModal && editingCondition !== null &&
                <NutrientFilterSelectionModal closeModal={closeFilterSelectionModal}
                                              existingCondition={editingCondition}
                                              editCondition={editCondition}
                />
                }
                <div className={"container row"}>
                    <div className={"col-6"}>
                        {renderFilterList()}
                    </div>
                    <div className={"col-6"}>
                        {renderResultList()}
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer className={"d-flex flex-row justify-content-between"}>
                <div>
                    {renderLeftFooterPart()}
                </div>
                <div>
                    {renderRightFooterPart()}
                </div>
            </Modal.Footer>
        </Modal>
    )
}